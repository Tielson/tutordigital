"use client"

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

// Import data from CSV
const schoolsData = [
  {
    "id": "6a26bce0-7ba8-463e-b492-c0a0c410d51d",
    "name": "Colégio Estadual Maria Santos",
    "slug": "colegio-maria-santos",
    "logo_url": "https://placehold.co/200x200/E11D48/FFFFFF.png?text=CEMS",
  },
  {
    "id": "71676bc2-2204-4571-9346-de13780b30f7",
    "name": "Escola Municipal João da Silva",
    "slug": "escola-joao-silva",
    "logo_url": "https://placehold.co/200x200/3B82F6/FFFFFF.png?text=EMJS",
  },
  {
    "id": "80b9c5ea-5002-43b9-b836-a01e798b6575",
    "name": "Escola Futuro Brilhante",
    "slug": "futuro-brilhante",
    "logo_url": "https://placehold.co/200x200/10B981/FFFFFF.png?text=FB",
  },
  {
    "id": "9e24c16d-6460-4c25-b5c1-4d619ace0c04",
    "name": "Instituto Educacional Progresso",
    "slug": "instituto-progresso",
    "logo_url": "https://placehold.co/200x200/F59E0B/FFFFFF.png?text=IEP",
  },
  {
    "id": "a707e257-eb6a-4c25-aacd-15c2fd54b87f",
    "name": "Colégio Inovação",
    "slug": "colegio-inovacao",
    "logo_url": "https://placehold.co/200x200/4F46E5/FFFFFF.png?text=CI",
  }
];

export default function ImportSchoolsButton({ onSuccess }: { onSuccess?: () => void }) {
  const [isImporting, setIsImporting] = useState(false)

  const importSchools = async () => {
    try {
      setIsImporting(true)
      
      const response = await fetch('/api/import-schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schools: schoolsData }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Escolas importadas",
          description: `${result.imported?.length || 0} escolas foram importadas com sucesso.`,
        })
        if (onSuccess) onSuccess();
      } else {
        toast({
          title: "Erro ao importar escolas",
          description: result.error || "Ocorreu um erro ao importar as escolas.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error importing schools:', error);
      toast({
        title: "Erro",
        description: "Não foi possível importar as escolas. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="mt-4 text-center">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={importSchools} 
        disabled={isImporting}
      >
        {isImporting ? "Importando..." : "Importar Escolas de Teste"}
      </Button>
      <p className="text-xs text-muted-foreground mt-1">
        Apenas para ambiente de desenvolvimento
      </p>
    </div>
  )
} 