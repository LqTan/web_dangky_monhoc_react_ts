import React, { useEffect, useState } from 'react';
import { fetchRegisteredClasses, RegisteredClassInfo } from '../../../services/apis/classRegistrationAPI';
import '../../../styles/pages/studentInfo/classSchedule/ClassSchedule.css';

interface TimeSlot {
  time: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

const ClassSchedule = () => {
  const [registeredClasses, setRegisteredClasses] = useState<RegisteredClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRegisteredClasses = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id;      
        const data = await fetchRegisteredClasses(userId);
        setRegisteredClasses(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Không thể tải lịch học. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    loadRegisteredClasses();
  }, []);

  const generateScheduleTable = () => {
    // Tạo mảng các time slot duy nhất từ dữ liệu API
    const uniqueTimeSlots = Array.from(
      new Set(
        registeredClasses.map(cls => 
          `${cls.field_class_start_time} - ${cls.field_class_end_time}`)
      )
    ).sort();

    // Tạo bảng thời khóa biểu
    const table: TimeSlot[] = uniqueTimeSlots.map(timeSlot => ({
      time: timeSlot,
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: ''
    }));

    // Điền thông tin lớp học vào bảng
    registeredClasses.forEach((classItem) => {
      const timeSlot = `${classItem.field_class_start_time} - ${classItem.field_class_end_time}`;
      const rowIndex = table.findIndex(row => row.time === timeSlot);

      if (rowIndex !== -1) {
        classItem.field_class_weekdays.forEach((day) => {
          const dayMap: { [key: string]: keyof TimeSlot } = {
            '2': 'monday',
            '3': 'tuesday',
            '4': 'wednesday',
            '5': 'thursday',
            '6': 'friday',
            '7': 'saturday',
            '8': 'sunday'
          };
          
          const dayName = dayMap[day];
          if (dayName) {
            table[rowIndex][dayName] = `${classItem.field_class_code} (${classItem.field_room})`;
          }
        });
      }
    });

    return table;
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const schedule = generateScheduleTable();

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
  );
};

export default ClassSchedule;