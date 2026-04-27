import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'
import '../assets/fonts/NotoSans-Regular-normal.js'
import '../assets/fonts/NotoSans-Bold-bold.js'

const PDF_FONT_FAMILY = 'NotoSans-Regular'
const PDF_FONT_BOLD_FAMILY = 'NotoSans-Bold'

export function usePdfExport() {
  const compareByTime = (a, b) => {
    if (a.startMin !== b.startMin) return a.startMin - b.startMin
    return (a.title || '').localeCompare(b.title || '')
  }

  const buildCategoryRank = (presentations) => {
    const earliestByCategory = new Map()

    presentations.forEach((event) => {
      const category = event.session_category || 'zzz'
      const current = earliestByCategory.get(category)
      if (current === undefined || event.startMin < current) {
        earliestByCategory.set(category, event.startMin)
      }
    })

    const sortedCategories = [...earliestByCategory.keys()].sort((a, b) => {
      const timeA = earliestByCategory.get(a)
      const timeB = earliestByCategory.get(b)
      if (timeA !== timeB) return timeA - timeB
      return a.localeCompare(b)
    })

    return new Map(sortedCategories.map((category, index) => [category, index]))
  }

  const buildPresentationPlaceholders = (presentations, categoryRank) => {
    if (presentations.length === 0) return []

    // Step 1: compute time span for each category
    const categorySpans = new Map()
    presentations.forEach((event) => {
      const category = event.session_category || '—'
      const span = categorySpans.get(category)
      if (!span) {
        categorySpans.set(category, { startMin: event.startMin, endMin: event.endMin, startFmt: event.startFmt, endFmt: event.endFmt })
      } else {
        if (event.startMin < span.startMin) { span.startMin = event.startMin; span.startFmt = event.startFmt }
        if (event.endMin > span.endMin) { span.endMin = event.endMin; span.endFmt = event.endFmt }
      }
    })

    // Step 2: group categories that share the exact same time span
    const slotMap = new Map()
    categorySpans.forEach((span, category) => {
      const key = `${span.startMin}|${span.endMin}`
      if (!slotMap.has(key)) {
        slotMap.set(key, { ...span, categories: [] })
      }
      slotMap.get(key).categories.push(category)
    })

    // Step 3: one placeholder per slot, categories ordered by rank
    return [...slotMap.values()]
      .sort((a, b) => a.startMin - b.startMin)
      .map((slot) => {
        const sortedCategories = slot.categories.sort((a, b) => {
          const rankA = categoryRank.get(a) ?? Number.MAX_SAFE_INTEGER
          const rankB = categoryRank.get(b) ?? Number.MAX_SAFE_INTEGER
          return rankA !== rankB ? rankA - rankB : a.localeCompare(b)
        })

        return {
          event_format: 'presentation_placeholder',
          title: sortedCategories.length > 1
            ? `Presentations:\n${sortedCategories.join('\n')}`
            : `Presentations: ${sortedCategories[0]}`,
          location: '',
          author: [],
          track: '',
          startMin: slot.startMin,
          endMin: slot.endMin,
          startFmt: slot.startFmt,
          endFmt: slot.endFmt
        }
      })
  }

  const sortWorkshopEvents = (events) => {
    return [...events].sort(compareByTime)
  }

  const sortMainConferenceEvents = (events) => {
    const presentations = events.filter((e) => e.event_format === 'presentation')
    const generalEvents = events.filter((e) => e.event_format !== 'presentation')

    const categoryRank = buildCategoryRank(presentations)

    const placeholders = buildPresentationPlaceholders(presentations, categoryRank)
    const generalWithPlaceholders = [...generalEvents, ...placeholders].sort(compareByTime)

    const sortedPresentations = [...presentations].sort((a, b) => {
      const rankA = categoryRank.get(a.session_category || 'zzz') ?? Number.MAX_SAFE_INTEGER
      const rankB = categoryRank.get(b.session_category || 'zzz') ?? Number.MAX_SAFE_INTEGER
      if (rankA !== rankB) return rankA - rankB
      return compareByTime(a, b)
    })

    return { generalEvents: generalWithPlaceholders, presentationEvents: sortedPresentations }
  }

  const eventToRow = (event, trackColumns = []) => {
    const time = `${event.startFmt} - ${event.endFmt}`
    const title = event.title || ''
    const authors = event.author ? event.author.join(', ') : ''
    const track = event.track
      ? (trackColumns.find((t) => t.key === event.track)?.label || event.track)
      : ''

    if (['break', 'opening', 'networking', 'posters'].includes(event.event_format)) {
      return [time, title, '', '']
    }

    if (event.event_format === 'social') {
      return [time, `${title} @ ${event.location || ''}`, '', '']
    }

    if (event.event_format === 'presentation_placeholder') {
      return [time, title, '', '']
    }

    if (event.event_format === 'keynote') {
      return [`${time}\n${event.location || ''}`, `Keynote: ${title}`, authors, '']
    }

    if (['workshop', 'tutorial', 'presentation'].includes(event.event_format)) {
      return [`${time}\n${event.location || ''}`, title, authors, track]
    }

    return [`${time}\n${event.location || ''}`, title, authors, '']
  }

  const renderTable = (doc, rows, startY, margin, sectionHeaderRows = new Set()) => {
    autoTable(doc, {
      head: [['Time', 'Event', 'Author(s)', 'Track']],
      body: rows,
      startY,
      rowPageBreak: 'avoid',
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 45 },
        3: { cellWidth: 20 }
      },
      headStyles: {
        font: PDF_FONT_BOLD_FAMILY,
        fillColor: [100, 100, 100],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        font: PDF_FONT_FAMILY,
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      didParseCell: (data) => {
        if (data.section === 'body' && sectionHeaderRows.has(data.row.index)) {
          data.cell.styles.fillColor = [220, 220, 220]
          data.cell.styles.textColor = [50, 50, 50]
          data.cell.styles.font = PDF_FONT_BOLD_FAMILY
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.fontSize = 9
        }
      }
    })

    return doc.lastAutoTable.finalY + 10
  }

  const generateSchedulePdf = (schedules) => {
    const doc = new jsPDF({ format: 'a4' })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 10
    let isFirstSchedule = true

    doc.setFont(PDF_FONT_FAMILY, 'normal')

    schedules.forEach((schedule) => {
      const { title, days, trackColumns = [] } = schedule
      const normalizedTitle = (title || '').toLowerCase()
      const isWorkshopsSchedule = normalizedTitle.includes('workshop')
      const isMainConferenceSchedule = normalizedTitle.includes('main')

      if (!isFirstSchedule) doc.addPage()
      isFirstSchedule = false

      doc.setFontSize(18)
      doc.setFont(PDF_FONT_BOLD_FAMILY, 'bold')
      doc.text(title, pageWidth / 2, margin + 8, { align: 'center' })

      let yPosition = margin + 20

      days.forEach((day) => {
        if (yPosition > pageHeight - 50) {
          doc.addPage()
          yPosition = margin
        }

        doc.setFontSize(12)
        doc.setFont(PDF_FONT_BOLD_FAMILY, 'bold')
        doc.text(day.fullDate, margin, yPosition)
        yPosition += 8

        const pdfEvents = day.events.filter((e) => e.event_format !== 'milestone')

        if (pdfEvents.length === 0) {
          doc.setFont(PDF_FONT_FAMILY, 'normal')
          doc.setFontSize(10)
          doc.text('No events scheduled', margin + 5, yPosition)
          yPosition += 8
          return
        }

        if (isWorkshopsSchedule) {
          yPosition = renderTable(doc, sortWorkshopEvents(pdfEvents).map((e) => eventToRow(e, trackColumns)), yPosition, margin)
        }
        else if (isMainConferenceSchedule) {
          const { generalEvents, presentationEvents } = sortMainConferenceEvents(pdfEvents)

          const rows = []
          const sectionHeaderRows = new Set()

          // General events section
          sectionHeaderRows.add(rows.length)
          rows.push([{ content: 'General overview', colSpan: 4 }])
          generalEvents.forEach((event) => rows.push(eventToRow(event, trackColumns)))

          // Presentations section grouped by category
          let lastCategory = undefined
          presentationEvents.forEach((event) => {
            const category = event.session_category || '—'
            if (category !== lastCategory) {
              sectionHeaderRows.add(rows.length)
              rows.push([{ content: category, colSpan: 4 }])
              lastCategory = category
            }
            rows.push(eventToRow(event, trackColumns))
          })

          yPosition = renderTable(doc, rows, yPosition, margin, sectionHeaderRows)
        }
        else {
          yPosition = renderTable(doc, [...pdfEvents].sort(compareByTime).map((e) => eventToRow(e, trackColumns)), yPosition, margin)
        }
      })
    })

    return doc
  }

  const downloadPdf = (pdfDoc, filename = 'schedule.pdf') => {
    pdfDoc.save(filename)
  }

  const generateAndDownload = (schedules, filename = 'schedule.pdf') => {
    const pdfDoc = generateSchedulePdf(schedules)
    downloadPdf(pdfDoc, filename)
  }

  return {
    generateSchedulePdf,
    downloadPdf,
    generateAndDownload
  }
}
