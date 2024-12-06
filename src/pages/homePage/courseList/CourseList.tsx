import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/pages/homePage/CourseList.css';
import { Course, fetchCourses } from '../../../services/apis/courseAPI';
import { fetchCourseCategories } from '../../../services/apis/courseCategoryAPI';

interface CategoryData {
  id: string;
  name: string;
}

const CourseList = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Tải danh sách danh mục
        const categoryData = await fetchCourseCategories();
        setCategories(categoryData);
        if (categoryData.length > 0) {
          setSelectedCategory(categoryData[0].name);
        }

        // Tải danh sách khóa học
        const courseData = await fetchCourses();
        setCourses(courseData);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (categoriesRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = direction === 'left' 
        ? categoriesRef.current.scrollLeft - scrollAmount
        : categoriesRef.current.scrollLeft + scrollAmount;
      
      categoriesRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const filteredCourses = courses.filter(course => {
    const category = categories.find(cat => cat.id === course.categoryId);
    return category?.name === selectedCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="course-list-container">
      <h2 className="section-title">Khóa học nổi bật</h2>
      <div className="course-categories">
        <button 
          className="scroll-button left"
          onClick={() => scroll('left')}
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        <div className="categories-scroll" ref={categoriesRef}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-button ${selectedCategory === category.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
        <button 
          className="scroll-button right"
          onClick={() => scroll('right')}
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>

      <div className="courses-grid">
        {filteredCourses.map(course => (
          <div key={course.courseCode} className="course-card">
            <div className="course-image">
              <img 
                src={course.imageUrl} 
                alt={course.name} 
              />
            </div>
            <div className="course-info">
              <h3>
                <Link to={`/courses/${course.courseCode}`}>{course.name}</Link>
              </h3>
              <div className="course-details">
                <div className="course-code">
                  <i className="bi bi-code-slash"></i>
                  <span>{course.courseCode}</span>
                </div>
                <div className="course-price">
                  <i className="bi bi-currency-exchange"></i>
                  <span>{formatPrice(course.price)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="view-all-container">
        <Link to="/all-courses" className="view-all-button">
          Xem toàn bộ môn học
        </Link>
      </div>
    </div>
  );
};

export default CourseList;