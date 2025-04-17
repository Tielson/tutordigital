"use client"

import { Alert, AlertDescription } from "@/app/components/ui/alert"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { createClientSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import { useAuth, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import ImportSchoolsButton from "./components/ImportSchoolsButton"

type School = Database["public"]["Tables"]["schools"]["Row"]

export default function SelectSchoolPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [selectedSchool, setSelectedSchool] = useState<string>("")
  const [selectedSchoolData, setSelectedSchoolData] = useState<School | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // New school form state
  const [newSchoolName, setNewSchoolName] = useState("")
  const [newSchoolSlug, setNewSchoolSlug] = useState("")
  const [mode, setMode] = useState<"select" | "create">("select")
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { getToken } = useAuth()
  const { user, isLoaded } = useUser()

  const fetchSchools = async () => {
    try {
      console.log("Fetching schools...")
      setLoading(true)
      const supabase = createClientSupabaseClient()
      
      // Debug: Check if supabase client is initialized properly
      if (!supabase) {
        console.error("Supabase client is not initialized")
        setError("Erro ao conectar com o banco de dados")
        return
      }
      
      const { data, error } = await supabase.from("schools").select("*").order("name")

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }
      
      console.log("Schools fetched:", data)
      setSchools(data || [])
      
      // Check if storage bucket exists
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      
      if (bucketsError) {
        console.error("Error listing buckets:", bucketsError)
      } else {
        console.log("Available buckets:", buckets)
        const logosBucketExists = buckets.some(bucket => bucket.name === 'logos')
        
        if (!logosBucketExists) {
          console.warn("The 'logos' bucket does not exist. Creating it...")
          try {
            // Try to create the bucket
            const { error: createBucketError } = await supabase.storage.createBucket('logos', {
              public: true
            })
            
            if (createBucketError) {
              console.error("Error creating logos bucket:", createBucketError)
            } else {
              console.log("Successfully created 'logos' bucket")
            }
          } catch (bucketCreationError) {
            console.error("Error creating bucket:", bucketCreationError)
          }
        }
      }
    } catch (error) {
      console.error("Error fetching schools:", error)
      setError("Erro ao carregar escolas. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchools()
  }, [])

  // Generate slug from school name
  useEffect(() => {
    if (newSchoolName) {
      const slug = newSchoolName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      
      setNewSchoolSlug(slug)
    } else {
      setNewSchoolSlug("")
    }
  }, [newSchoolName])

  // Update selectedSchoolData when a school is selected
  useEffect(() => {
    if (selectedSchool && mode === "select") {
      const school = schools.find(s => s.id === selectedSchool)
      setSelectedSchoolData(school || null)
      // If school already has a logo, show it
      if (school?.logo_url) {
        setLogoPreview(school.logo_url)
      } else {
        setLogoPreview(null)
        setLogoFile(null)
      }
    } else {
      setSelectedSchoolData(null)
      if (mode === "select") {
        setLogoPreview(null)
        setLogoFile(null)
      }
    }
  }, [selectedSchool, schools, mode])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadLogo = async (schoolId: string): Promise<string | null> => {
    if (!logoFile) return null
    
    try {
      setUploadingLogo(true)
      const supabase = createClientSupabaseClient()
      
      // Create a unique file name with timestamp
      const fileExt = logoFile.name.split('.').pop()
      const fileName = `${schoolId}-logo-${Date.now()}.${fileExt}`
      const filePath = `school-logos/${fileName}`
      
      // Upload to storage
      const { error: uploadError, data } = await supabase.storage
        .from('logos')
        .upload(filePath, logoFile, {
          upsert: true,
          contentType: logoFile.type
        })
      
      if (uploadError) throw uploadError
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('logos')
        .getPublicUrl(filePath)
      
      return urlData.publicUrl
    } catch (error) {
      console.error("Error uploading logo:", error)
      return null
    } finally {
      setUploadingLogo(false)
    }
  }

  async function handleCreateSchool() {
    if (!newSchoolName || !newSchoolSlug || !user) return
    
    try {
      setLoading(true)
      setError(null)
      
      const supabase = createClientSupabaseClient()
      
      // Create new school
      const { data: newSchool, error: createError } = await supabase
        .from("schools")
        .insert({
          name: newSchoolName,
          slug: newSchoolSlug,
          logo_url: null, // Will update after logo upload
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (createError) {
        throw createError
      }
      
      // Upload logo if provided
      let logoUrl = null
      if (logoFile) {
        logoUrl = await uploadLogo(newSchool.id)
        
        if (logoUrl) {
          // Update school with logo URL
          await supabase
            .from("schools")
            .update({ logo_url: logoUrl })
            .eq("id", newSchool.id)
        }
      }
      
      // Update user metadata
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          schoolId: newSchool.id,
          schoolName: newSchool.name,
          schoolSlug: newSchool.slug,
          schoolLogoUrl: logoUrl
        },
      })
      
      // Redirect to dashboard
      router.push("/dashboard")
      
    } catch (error) {
      console.error("Error creating school:", error)
      setError("Erro ao criar escola. Por favor, tente novamente.")
      setLoading(false)
    }
  }

  async function handleSelectSchool() {
    if (!selectedSchool || !user || !selectedSchoolData) return

    try {
      setLoading(true)
      setError(null)
      
      // Upload logo if provided
      let logoUrl = selectedSchoolData.logo_url
      if (logoFile) {
        const uploadedUrl = await uploadLogo(selectedSchool)
        if (uploadedUrl) {
          logoUrl = uploadedUrl
          
          // Update school record with new logo URL
          const supabase = createClientSupabaseClient()
          await supabase.from("schools")
            .update({ logo_url: uploadedUrl })
            .eq("id", selectedSchool)
        }
      }

      // Update user metadata with selected school details
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          schoolId: selectedSchool,
          schoolName: selectedSchoolData.name,
          schoolSlug: selectedSchoolData.slug,
          schoolLogoUrl: logoUrl
        },
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error selecting school:", error)
      setError("Erro ao selecionar escola. Por favor, tente novamente.")
      setLoading(false)
    }
  }

  const handleModeChange = (value: string) => {
    setMode(value as "select" | "create")
    setError(null)
  }

  if (!isLoaded) {
    return <div className="flex min-h-screen items-center justify-center">Carregando...</div>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sua Escola</CardTitle>
          <CardDescription>Selecione ou crie a escola que você administra</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={mode} onValueChange={handleModeChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="select">Selecionar Escola</TabsTrigger>
              <TabsTrigger value="create">Nova Escola</TabsTrigger>
            </TabsList>
            
            <TabsContent value="select" className="space-y-4">
              <Select value={selectedSchool} onValueChange={setSelectedSchool} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma escola" />
                </SelectTrigger>
                <SelectContent>
                  {schools.length === 0 ? (
                    <SelectItem value="none" disabled>
                      Nenhuma escola encontrada
                    </SelectItem>
                  ) : (
                    schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              
              {selectedSchoolData && (
                <div className="space-y-4 mt-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="select-logo">Logo da escola</Label>
                    <div className="mt-2 flex items-center gap-4">
                      {logoPreview && (
                        <div className="w-20 h-20 rounded-md border overflow-hidden">
                          <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <Input
                          ref={fileInputRef}
                          id="select-logo"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                className="w-full mt-4" 
                onClick={handleSelectSchool} 
                disabled={!selectedSchool || loading || uploadingLogo || schools.length === 0}
              >
                {loading || uploadingLogo ? "Carregando..." : "Continuar"}
              </Button>
            </TabsContent>
            
            <TabsContent value="create" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="school-name">Nome da Escola</Label>
                <Input 
                  id="school-name" 
                  placeholder="Ex: Colégio Estadual Maria Santos" 
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="school-slug">Identificador (slug)</Label>
                <Input 
                  id="school-slug" 
                  placeholder="Ex: colegio-maria-santos" 
                  value={newSchoolSlug}
                  onChange={(e) => setNewSchoolSlug(e.target.value)}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Identificador único da escola, usado em URLs
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-logo">Logo da Escola</Label>
                <div className="mt-2 flex items-center gap-4">
                  {logoPreview && (
                    <div className="w-20 h-20 rounded-md border overflow-hidden">
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      id="create-logo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={handleCreateSchool} 
                disabled={!newSchoolName || !newSchoolSlug || loading || uploadingLogo}
              >
                {loading || uploadingLogo ? "Carregando..." : "Criar Escola"}
              </Button>
            </TabsContent>
          </Tabs>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Import schools button for development */}
          {process.env.NODE_ENV === 'development' && (
            <ImportSchoolsButton onSuccess={fetchSchools} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
