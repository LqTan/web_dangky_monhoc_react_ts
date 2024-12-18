import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/pages/homePage/CourseList.css';
import { Course, fetchCourses } from '../../../services/apis/courseAPI';
import { fetchCourseCategories } from '../../../services/apis/courseCategoryAPI';

interface CategoryData {
  tid: string;
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
    return course.training_program_tid === categories.find(cat => cat.name === selectedCategory)?.tid;
  });

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseFloat(price));
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    return imagePath.replace('public://', 'http://course-management.lndo.site/sites/default/files/');
  }

  return (
    <div className="homepage-course-list-container">
      <h2 className="homepage-section-title">Khóa học nổi bật</h2>
      <div className="homepage-course-categories">
        <button 
          className="homepage-scroll-button homepage-left"
          onClick={() => scroll('left')}
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        <div className="homepage-categories-scroll" ref={categoriesRef}>
          {categories.map((category) => (
            <button
              key={category.tid}
              className={`homepage-category-button ${selectedCategory === category.name ? 'homepage-active' : ''}`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
        <button 
          className="homepage-scroll-button homepage-right"
          onClick={() => scroll('right')}
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>

      <div className="homepage-courses-grid">
        {filteredCourses.map(course => (
          <div key={course.field_course_code} className="homepage-course-card">
            <div className="homepage-course-image">
              <img 
                src={getImageUrl(course.field_course_thumbnail)} 
                alt={course.title} 
              />
            </div>
            <div className="homepage-course-info">
              <h3>
                <Link to={`/courses/${course.field_course_code}`}>{course.title}</Link>
              </h3>
              <div className="homepage-course-details">
                <div className="homepage-course-code">
                  <i className="bi bi-code-slash"></i>
                  <span>{course.field_course_code}</span>
                </div>
                <div className="homepage-course-price">
                  <i className="bi bi-currency-exchange"></i>
                  <span>{formatPrice(course.field_course_tuition_fee)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="homepage-view-all-container">
        <Link to="/all-courses" className="homepage-view-all-button">
          Xem toàn bộ môn học
        </Link>
      </div>
    </div>
  );
};

export default CourseList;