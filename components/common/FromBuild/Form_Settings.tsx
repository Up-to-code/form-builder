"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFormStore } from '@/store/form-store'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import React from 'react'

function Form_Settings() {
    const {setFormTitle, formTitle }  = useFormStore()
  return (
    
    <Card>
    <CardHeader>
      <CardTitle>Form Settings</CardTitle>
    </CardHeader>
    <CardContent>
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <div className="space-y-4 mt-4">
            <div>
              <label htmlFor="formName" className="block text-sm font-medium text-muted-foreground mb-1">
                Form Name
              </label>
              <input
                id="formName"
                type="text"
                className="w-full p-2 rounded-md border"
                placeholder="Enter form name"
                defaultValue={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>
       
          </div>
        </TabsContent>
        <TabsContent value="advanced">
          <div className="space-y-4 mt-4">
            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span className="text-sm text-muted-foreground">Enable CAPTCHA</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span className="text-sm text-muted-foreground">Limit submissions</span>
              </label>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
  )
}

export default Form_Settings