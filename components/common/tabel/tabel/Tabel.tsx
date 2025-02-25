"use client"

import { useState, useEffect } from "react"
import { getFormSubmissions, deleteSubmission, type SubmissionData } from "@/app/actions/getFromTable"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DownloadIcon, TrashIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function SubmissionsTable({ formId }: { formId: string }) {
  const [submissions, setSubmissions] = useState<SubmissionData[]>([])
  const [loading, setLoading] = useState(true)
  const [columns, setColumns] = useState<string[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchSubmissions = async () => {
    setLoading(true)
    const { success, data, error } = await getFormSubmissions(formId)
    
    if (success && data) {
      // Add updatedAt property if it's missing to match SubmissionData type
      const formattedData = data.map(submission => ({
        ...submission,
        updatedAt: submission.updatedAt || submission.createdAt // Use createdAt as fallback
      })) as SubmissionData[]
      
      setSubmissions(formattedData)
      
      // Extract all unique field names from all submissions
      if (formattedData.length > 0) {
        const allKeys = new Set<string>()
        formattedData.forEach(submission => {
          // Safely access the data property
          const submissionData = submission.data || {}
          // Ensure data is an object before calling Object.keys
          if (submissionData && typeof submissionData === 'object' && submissionData !== null) {
            Object.keys(submissionData).forEach(key => allKeys.add(key))
          }
        })
        setColumns(Array.from(allKeys))
      }
    } else {
      toast({
        title: "Error",
        description: error || "Failed to fetch submissions",
        variant: "destructive",
      })
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchSubmissions()
  }, [formId])

  const handleDelete = async (submissionId: string) => {
    setDeletingId(submissionId)
    const { success, error } = await deleteSubmission(submissionId)
    
    if (success) {
      toast({
        title: "Success",
        description: "Submission deleted successfully",
      })
      // Refresh the list
      fetchSubmissions()
    } else {
      toast({
        title: "Error",
        description: error || "Failed to delete submission",
        variant: "destructive",
      })
    }
    setDeletingId(null)
  }

  const exportToCSV = () => {
    if (submissions.length === 0) return
    
    // Create CSV header
    const header = ['Submission ID', 'Date', ...columns]
    
    // Create CSV rows
    const rows = submissions.map(submission => {
      const row = [
        submission.id,
        new Date(submission.createdAt).toLocaleString(),
      ]
      
      // Add data fields
      columns.forEach(column => {
        // Safely access the data property
        const submissionData = submission.data || {}
        const value = typeof submissionData === 'object' && submissionData !== null 
          ? submissionData[column] || ''
          : ''
        row.push(String(value))
      })
      
      return row
    })
    
    // Combine header and rows
    const csvContent = [
      header.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `form-submissions-${formId}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (submissions.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Form Submissions</CardTitle>
          <CardDescription>No submissions found for this form yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={fetchSubmissions} className="flex items-center gap-2">
            Refresh
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Form Submissions</CardTitle>
            <CardDescription>
              {submissions.length} {submissions.length === 1 ? 'submission' : 'submissions'} received
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchSubmissions} className="flex items-center gap-2">
              Refresh
            </Button>
            <Button onClick={exportToCSV} className="flex items-center gap-2">
              <DownloadIcon className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submission ID</TableHead>
                <TableHead>Date</TableHead>
                {columns.map(column => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map(submission => (
                <TableRow key={submission.id}>
                  <TableCell className="font-mono text-xs">{submission.id.substring(0, 8)}...</TableCell>
                  <TableCell>{new Date(submission.createdAt).toLocaleString()}</TableCell>
                  {columns.map(column => (
                    <TableCell key={`${submission.id}-${column}`}>
                      {/* Safely access the data property */}
                      {typeof submission.data === 'object' && submission.data !== null
                        ? (submission.data[column] || '-')
                        : '-'}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Submission</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this submission? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(submission.id)}
                            disabled={deletingId === submission.id}
                          >
                            {deletingId === submission.id ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

