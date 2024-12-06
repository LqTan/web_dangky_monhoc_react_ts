import React, { useEffect, useState } from 'react';
import { fetchMyRegistrations } from '../../../services/apis/classRegistrationAPI';
import '../../../styles/pages/studentInfo/classSchedule/ClassSchedule.css';

interface RegisteredClass {
  classCode: string;
  courseId: string;
  schedule: number[];
  startTime: string;
  endTime: string;
  room: string;
  teacher: {
    email: string;
  };
}

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
  const [registeredClasses, setRegisteredClasses] = useState<RegisteredClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRegisteredClasses = async () => {
      try {
        const data = await fetchMyRegistrations();
        setRegisteredClasses(data.registeredClasses);
        setLoading(false);
      } catch (err) {
        console.log(err);
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
        registeredClasses.map(cls => `${cls.startTime} - ${cls.endTime}`)
      )
    ).sort();

    // Tạo bảng thời khóa biểu với các time slot từ API
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
      const timeSlot = `${classItem.startTime} - ${classItem.endTime}`;
      const rowIndex = table.findIndex(row => row.time === timeSlot);

      if (rowIndex !== -1) {
        classItem.schedule.forEach((day) => {
          const dayName = day === 8 ? 'sunday' : 
  ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][day - 2] as keyof TimeSlot;
table[rowIndex][dayName] = `${classItem.courseId} (${classItem.room})`;
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