"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { SchoolFormData, schoolFormSchema } from "@/lib/schemas"
import { createClientSupabaseClient } from "@/lib/supabase"
import { useUser } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"

// Type for mutation data
interface CreateSchoolPayload {
  name: string;
  slug: string;
  logoFile: File | null;
  userId: string;
  currentMetadata: Record<string, any> | undefined;
}

// Function to handle school creation logic (upload logo, insert school, update metadata)
async function createSchool({ name, slug, logoFile, userId, currentMetadata }: CreateSchoolPayload) {
  const supabase = createClientSupabaseClient()
  let logoUrl: string | null = null


  // --- 1. Insert School (without logo first) ---
  const { data: newSchool, error: createError } = await supabase
    .from("schools")
    .insert({
      name,
      slug,
      logo_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (createError) {
    console.error("Supabase insert error:", createError)
    if (createError.code === '23505') {
      throw new Error("Este identificador (slug) já está em uso.")
    }
    throw new Error(`Erro ao criar escola: ${createError.message}`)
  }

  // --- 2. Upload Logo (if provided) --- 
  if (logoFile) {
    try {
      const fileExt = logoFile.name.split('.').pop()
      const fileName = `${newSchool.id}-logo-${Date.now()}.${fileExt}`
      const filePath = `school-logos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, logoFile, {
          upsert: true,
          contentType: logoFile.type
        })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('logos').getPublicUrl(filePath)
      logoUrl = urlData.publicUrl

      // --- 3. Update School with Logo URL --- 
      const { error: updateError } = await supabase
        .from("schools")
        .update({ logo_url: logoUrl })
        .eq("id", newSchool.id)

      if (updateError) throw updateError

    } catch (uploadOrUpdateError: any) {
      // Attempt to clean up if logo upload/update fails
      console.error("Error during logo upload/update:", uploadOrUpdateError)
      // Try deleting the created school record
      await supabase.from("schools").delete().eq("id", newSchool.id)
      throw new Error(`Falha no processamento do logo: ${uploadOrUpdateError.message}`)
    }
  }

  // --- 4. Update Clerk User Metadata --- 
  // Use fetch to call Clerk's Backend API - this is more reliable immediately after changes
  const clerkUpdateRes = await fetch(`/api/update-clerk-metadata`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      metadata: {
        schoolId: newSchool.id,
        schoolName: newSchool.name,
        schoolSlug: newSchool.slug,
        schoolLogoUrl: logoUrl
      }
    })
  })

  if (!clerkUpdateRes.ok) {
    // Attempt cleanup if metadata update fails
    await supabase.from("schools").delete().eq("id", newSchool.id)
    if (logoUrl) {
      // Try to delete logo if it was uploaded
      const filePath = logoUrl.substring(logoUrl.indexOf('school-logos/'))
      await supabase.storage.from('logos').remove([filePath])
    }
    throw new Error("Falha ao atualizar metadados do usuário.")
  }

  return { ...newSchool, logo_url: logoUrl } // Return the final school data
}

export default function NewSchoolPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const form = useForm<SchoolFormData>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      logo: undefined,
    },
  })

  // Generate slug from name
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'name' && value.name) {
        const slug = value.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/(^-|-$)/g, "")
        form.setValue("slug", slug, { shouldValidate: true })
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  const createSchoolMutation = useMutation({
    mutationFn: createSchool,
    onSuccess: async (data) => {
      router.push("/dashboard") 
      toast({
        title: "Escola Criada!",
        description: `A escola "${data.name}" foi cadastrada com sucesso.`,
      });
    },
    onError: (error: Error) => {
      console.error("Erro ao criar escola:", error);
      toast({
        title: "Erro ao Criar Escola",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: SchoolFormData) {
    if (!user) return;

    createSchoolMutation.mutate({
      name: data.name,
      slug: data.slug,
      logoFile: data.logo || null,
      userId: user.id,
      currentMetadata: user.unsafeMetadata,
    })
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      form.setValue("logo", file, { shouldValidate: true })
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => setLogoPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    } else {
      form.setValue("logo", undefined)
      setLogoPreview(null)
    }
  }

  if (!isLoaded || createSchoolMutation.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center mt-10">
        {createSchoolMutation.isPending ? "Criando escola..." : "Carregando..."}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Configurar sua Escola</CardTitle>
          <CardDescription>Cadastre os dados da sua escola para começar.</CardDescription>
        </CardHeader>


        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Escola</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Colégio Estadual Maria Santos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identificador (slug)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: colegio-maria-santos" {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Usado em URLs (gerado automaticamente, pode ser ajustado).
                    </p>
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Logo da Escola (Opcional)</FormLabel>
                <div className="mt-1 flex items-center gap-4">
                  {logoPreview && (
                    <div className="w-20 h-20 rounded-md border overflow-hidden bg-gray-100 flex items-center justify-center">
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    {/* We don't use FormField for file input directly with RHF's default register */}
                    <Input
                      id="create-logo"
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp, image/gif"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    <FormMessage>{/* Error for logo field if needed */}</FormMessage>
                    <p className="text-xs text-muted-foreground mt-1">Recomendado: 200x200 pixels</p>
                  </div>
                </div>
              </FormItem>

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={createSchoolMutation.isPending}
              >
                {createSchoolMutation.isPending ? "Criando..." : "Criar Escola e Continuar"}
              </Button>

              {createSchoolMutation.isError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{createSchoolMutation.error.message}</AlertDescription>
                </Alert>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 