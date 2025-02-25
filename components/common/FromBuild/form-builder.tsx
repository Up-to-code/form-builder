
"use client"
import { useFormStore } from "@/store/form-store"
import { FormTitle } from "./form-title"
import { AddInputButton } from "./add-input-button"
import { InputFieldEditor } from "./input-field-editor"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export function FormBuilder() {
  const { inputs, moveInput , formTitle } = useFormStore()

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }
    moveInput(result.source.index, result.destination.index)
  }

  return (
    <div className="w-full max-w-3xl mx-auto lg:col-span-2 "> 
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
           <h1 className="text-2xl font-bold">{formTitle}</h1>
          <AddInputButton />
        </div>
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="form-fields">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {inputs.map((input, index) => (
                    <Draggable key={input.id} draggableId={input.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <InputFieldEditor input={input} index={index} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ScrollArea>
      </CardContent>
    </div>
  )
}

