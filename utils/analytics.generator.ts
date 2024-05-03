import { Document, Model, FilterQuery } from 'mongoose'
import { start } from 'repl'

interface MonthData {
  month: string
  count: number
}

export async function generateLast12MonthsData<T extends Document>(
  model: Model<T>
): Promise<{ last12Months: MonthData[] }> {
  const last12Months: MonthData[] = []
  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() + 1)

  for (let i = 11; i >= 0; i--) {
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - i * 28
    )
    const startDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate() - 28
    )

    const monthYear = endDate.toLocaleString('default', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

    // Criar objeto de consulta dinamicamente
    const query: FilterQuery<T> = {
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      } as any, // "as any" é usado aqui para evitar problemas de tipo
    }

    const count = await model.countDocuments(query)

    last12Months.push({ month: monthYear, count })
  }
  return { last12Months }
}
