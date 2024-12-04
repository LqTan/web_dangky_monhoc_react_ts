import React from 'react'
import Header from '../../components/header/Header'
import Carousel from '../homePage/carousel/Carousel'
import Categories from '../homePage/categories/Categories'
import Footer from '../../components/footer/Footer'
import News from './news/News'
import CourseList from './courseList/CourseList'

const HomePage = () => {
  return (
    <div className="home-page">      
      <Carousel />
      <Categories />      
      <News />
      <CourseList />
    </div>
  )
}

export default HomePage