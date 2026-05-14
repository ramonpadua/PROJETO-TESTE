import * as React from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface DatePickerProps {
  date?: Date
  setDate: (date?: Date) => void
  placeholder?: string
  className?: string
}

export function DatePicker({
  date,
  setDate,
  placeholder = 'Selecione uma data',
  className,
}: DatePickerProps) {
  return (
    <Popover>
      <div className="relative w-full">
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal bg-white pr-8',
              !date && 'text-muted-foreground',
              className,
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'P', { locale: ptBR }) : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        {date && (
          <div
            className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer p-1.5 hover:bg-slate-100 rounded-full z-10 text-slate-500 hover:text-slate-700 transition-colors"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDate(undefined)
            }}
            role="button"
            aria-label="Limpar data"
          >
            <X className="h-4 w-4" />
          </div>
        )}
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={ptBR} />
      </PopoverContent>
    </Popover>
  )
}
