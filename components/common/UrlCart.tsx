"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { Copy, Check } from 'lucide-react'

function UrlCart({ id }: { id: string }) {
  const [copied, setCopied] = useState(false)
const shareUrl = `${window.location.origin}/f/${id}`
  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="w-full max-w-md my-5 mx-4 h-max">
      <CardHeader>
        <h2 className="text-xl font-semibold">Share Link</h2>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-100 rounded p-3 font-mono text-sm mb-4">
          {shareUrl}
        </div>
        <Button 
          onClick={handleCopy} 
          variant="default"
          className="w-40"
        >
          {copied ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copied ? 'Copied!' : 'Copy Link'}
        </Button>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Copy and share with your friends
        </p>
      </CardFooter>
    </Card>
  )
}

export default UrlCart