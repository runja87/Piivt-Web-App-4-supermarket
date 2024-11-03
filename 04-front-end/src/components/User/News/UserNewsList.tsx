import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import INews from '../../../models/INews.model';
import { api } from '../../../api/api';
import './UserNewsList.sass'; 
import IConfig from '../../../common/IConfig.interface';
import DevConfig from '../../../configs';

const UserNewsList = () => {
  const { id } = useParams(); 
  const [news, setNews] = useState<INews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const config: IConfig = DevConfig;
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api("get", `/api/category/${id}/news`);
        if (response.status === "ok") {
          setNews(response.data || []);
        } else {
          setErrorMessage("No news found.");
        }
      } catch (error) {
        setErrorMessage("Error fetching news.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  return (
    <div className="UserNewsList">
      {isLoading ? (
        <p>Loading news...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        news.length > 0 ? (
          <ul>
            {news.map(item => (
              <li key={item.newsId}>
                {item.photos.length > 0 ? (
                  <img
                    alt={item.photos[0]?.altText}
                    src={
                      config.domain.name+":"+config.domain.port+"/assets/" +
                      item.photos[0].filePath.replace(
                        item.photos[0].name,
                        "medium-" + item.photos[0].name
                      )
                    }
                    className="news-image" 
                  />
                ) : (
                  <div className="no-image-placeholder">
                    <p>No image available</p>
                  </div>
                )}
                <h3>{item.title}</h3>
                <article className="content">{item.content}</article>
                
                <p>Published: {new Date(item.createdAt).toLocaleDateString()}</p>
                <p>Modified: {new Date(item.modifiedAt).toLocaleDateString()}</p>
                <p className="metadata">Metadata: {item.altText || "No metadata available"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No news found in this category.</p>
        )
      )}
    </div>
  );
}  
export default UserNewsList;
