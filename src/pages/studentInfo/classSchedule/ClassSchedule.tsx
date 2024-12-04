import React from 'react'
import '../../../styles/pages/studentInfo/classSchedule/ClassSchedule.css'

const ClassSchedule = () => {
  const schedule = [
    {
      time: '18:00 - 20:00',
      monday: 'Tin học văn phòng (A101)',
      tuesday: '',
      wednesday: 'Tin học văn phòng (A101)',
      thursday: '',
      friday: '',
      saturday: 'Tin học văn phòng (A101)',
      sunday: ''
    },
    {
      time: '20:00 - 21:30',
      monday: '',
      tuesday: 'Tiếng Anh B1 (B203)',
      wednesday: '',
      thursday: 'Tiếng Anh B1 (B203)',
      friday: '',
      saturday: '',
      sunday: ''
    }
  ]

  return (
    <div className="profile-card">
      <h2 className="schedule-title">Lịch học</h2>
      <div className="schedule-table">
        <table>
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Thứ 2</th>
              <th>Thứ 3</th>
              <th>Thứ 4</th>
              <th>Thứ 5</th>
              <th>Thứ 6</th>
              <th>Thứ 7</th>
              <th>Chủ nhật</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((slot, index) => (
              <tr key={index}>
                <td>{slot.time}</td>
                <td>{slot.monday}</td>
                <td>{slot.tuesday}</td>
                <td>{slot.wednesday}</td>
                <td>{slot.thursday}</td>
                <td>{slot.friday}</td>
                <td>{slot.saturday}</td>
                <td>{slot.sunday}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ClassSchedule