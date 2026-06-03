export const timetablesConfig = {
  "main": {
    "TRACK_HEAD": 30,
    "TRACK_COLUMNS": [
      { "key": "track1", "label": "Track 1", "theme": "track-666" },
      { "key": "track2", "label": "Track 2", "theme": "track-666" },
      { "key": "track3", "label": "Track 3", "theme": "track-666" }
    ],
    "days": [
      {
        "date": "2026-06-17",
        "SCALE_ZONES": [
          { startHour: "08:00", endHour: "09:00", pxPerMin: 2 },
          { startHour: "09:00", endHour: "09:30", pxPerMin: 6 },
          { startHour: "09:30", endHour: "10:30", pxPerMin: 4 },
          { startHour: "10:30", endHour: "11:00", pxPerMin: 2 },
          { startHour: "11:00", endHour: "12:40", pxPerMin: 14 },
          { startHour: "12:40", endHour: "13:40", pxPerMin: 2 },
          { startHour: "13:40", endHour: "15:00", pxPerMin: 14 },
          { startHour: "15:00", endHour: "15:15", pxPerMin: 4 },
          { startHour: "15:15", endHour: "18:00", pxPerMin: 2 },
          { startHour: "18:00", endHour: "20:00", pxPerMin: 4 },
          { startHour: "20:00", endHour: "24:00", pxPerMin: 2 }
        ]
      },
      {
        "date": "2026-06-18",
        "SCALE_ZONES": [
          { startHour: "08:00", endHour: "10:30", pxPerMin: 4 },
          { startHour: "10:30", endHour: "11:00", pxPerMin: 2 },
          { startHour: "11:00", endHour: "12:20", pxPerMin: 14 },
          { startHour: "12:20", endHour: "13:20", pxPerMin: 2 },
          { startHour: "13:20", endHour: "14:20", pxPerMin: 4 },
          { startHour: "14:20", endHour: "15:40", pxPerMin: 14 },
          { startHour: "15:40", endHour: "16:10", pxPerMin: 2 },
          { startHour: "16:10", endHour: "17:30", pxPerMin: 14 },
          { startHour: "17:30", endHour: "24:00", pxPerMin: 1 }
        ]
      },
      {
        "date": "2026-06-19",
        "SCALE_ZONES": [
          { startHour: "08:00", endHour: "10:00", pxPerMin: 4 },
          { startHour: "10:00", endHour: "10:30", pxPerMin: 2 },
          { startHour: "10:30", endHour: "12:30", pxPerMin: 14 },
          { startHour: "12:30", endHour: "13:00", pxPerMin: 2 },
          { startHour: "13:00", endHour: "13:30", pxPerMin: 18 },
          { startHour: "13:30", endHour: "15:00", pxPerMin: 2 }
        ]
      }
    ]
  },
  "workshops": {
    "TRACK_HEAD": 30,
    "TRACK_COLUMNS": [
      { "key": "track1", "label": "Track 1", "theme": "track-666" },
      { "key": "track2", "label": "Track 2", "theme": "track-666" },
      { "key": "track3", "label": "Track 3", "theme": "track-666" },
      { "key": "track4", "label": "Track 4", "theme": "track-666" }
    ],
    "days": [
      {
        "date": "2026-06-16",
        "SCALE_ZONES": [
          { startHour: "08:00", endHour: "9:00", pxPerMin: 2 },
          { startHour: "09:00", endHour: "18:00", pxPerMin: 3 },
          { startHour: "18:00", endHour: "24:00", pxPerMin: 1 }
        ]
      }
    ]
  }
}
