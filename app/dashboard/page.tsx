import { getAllForms } from "../actions/getAllForms"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Edit } from "lucide-react"
import Link from "next/link"

async function DashboardPage() {
  const forms = await getAllForms()

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Forms</h1>
        <Button asChild>
          <Link href="/dashboard/create-from">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Form
          </Link>
        </Button>
      </div>

      {forms?.forms.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No forms available. Create your first form to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms?.forms.map((form) => (
            <Card key={form.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{form.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
               </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/dashboard/f-data/${form.id}`}>
                    <Edit className="mr-2 h-4 w-4" /> View Data
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/dashboard/edit-form/${form.id}`}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Form
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default DashboardPage

