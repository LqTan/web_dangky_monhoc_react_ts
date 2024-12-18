import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/pages/homePage/NewsDetail.css';

const BASE_URL = 'http://course-management.lndo.site';

interface NewsItem {
  title: string;
  changed: string;
  body: string;
  field_file_upload: string;
  field_term_name: string;
  vid: string;
}

const NewsDetail = () => {
  const { tid } = useParams();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await axios.get(`http://course-management.lndo.site/api/news/${tid}`);
        setNewsItems(response.data);
      } catch (error) {
        console.error('Error fetching news detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [tid]);

  useEffect(() => {
    const scaleContent = () => {
      if (contentRef.current) {
        const content = contentRef.current;
        const container = content.parentElement;
        
        if (container) {
          // Reset scale và style
          content.style.transform = 'scale(1)';
          content.style.width = 'auto';
          
          // Get dimensions sau khi reset
          const contentWidth = content.scrollWidth;
          const containerWidth = container.clientWidth;
          
          if (contentWidth > containerWidth) {
            // Set width cho content bằng với container
            content.style.width = '100%';
            // Tính toán scale
            const scale = containerWidth / contentWidth;
            // Áp dụng scale và đảm bảo căn giữa
            content.style.transform = `scale(${scale})`;
            content.style.transformOrigin = 'top left';
            // Điều chỉnh height của container
            container.style.height = `${content.scrollHeight * scale}px`;
          }
        }
      }
    };

    // Scale on load and window resize
    setTimeout(scaleContent, 0);
    window.addEventListener('resize', scaleContent);

    return () => {
      window.removeEventListener('resize', scaleContent);
    };
  }, [newsItems]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  // Chuyển đổi timestamp thành ngày tháng năm
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    
    const formattedDate = date.toLocaleDateString('vi-VN', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
    
    const formattedTime = date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    return `${formattedDate} - ${formattedTime}`;
  }

  return (
    <div className="news-detail-container">
      {newsItems.map((newsItem, index) => (
        <div key={index} className="news-item-detail">
          <div className="news-detail-header">
            <h1>{newsItem.title}</h1>
            <div className="news-detail-meta">
              <span className="category">Danh mục: {newsItem.field_term_name}</span>
              <span className="date">Ngày đăng: {formatTimestamp(newsItem.changed)}</span>
            </div>
          </div>
          
          <div className="news-detail-content">
            <div 
              ref={contentRef}
              className='content-wrapper'
              dangerouslySetInnerHTML={{ __html: newsItem.body }} 
            />
          </div>

          {newsItem.field_file_upload && (
            <div className="news-detail-attachment">
              <h4>Tài liệu đính kèm:</h4>
              <a 
                href={`${BASE_URL}${newsItem.field_file_upload}`}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <i className="bi bi-file-earmark-text"></i> 
                Tải xuống tài liệu
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NewsDetail;