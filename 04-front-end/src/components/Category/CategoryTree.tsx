import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ICategory from '../../models/ICategory.model';
import IProduct from '../../models/IProduct.model';
import { api } from "../../api/api";
import RecursiveCategoryMenu from './RecursiveCategoryMenu';
import INews from '../../models/INews.model';

const CategoryTree: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [,setActiveCategoryProducts] = useState<IProduct[]>([]);
  const [,setActiveCategoryNews] = useState<INews[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const apiResponse = await api("get", "/api/category");
      if (apiResponse.status === "ok") {
        setCategories(apiResponse.data || []);
      } else {
        throw new Error("Failed to load categories.");
      }
    } catch (error) {
      setErrorMessage("Error loading categories.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

 
  const handleCategoryClick = useCallback(async (category: ICategory) => {
    if (String(category.categoryId) === activeCategoryId) {
      setActiveCategoryId(null);
      setActiveCategoryProducts([]);
      setActiveCategoryNews([]);
    } else {
      setActiveCategoryId(String(category.categoryId));
      if (category.categoryType === 'product') {
        if (category.threeLevelStructure.length === 0) {
          setActiveCategoryProducts(category.products || []);
          setActiveCategoryNews([]);
          navigate(`/category/${category.categoryId}/product`);
        } else {
          setActiveCategoryProducts([]);
          setActiveCategoryNews([]);
        }
      } else if (category.categoryType === 'news') {
        if (category.threeLevelStructure.length === 0) {
          setActiveCategoryProducts([]);
          setActiveCategoryNews(category.news || []);
          navigate(`/category/${category.categoryId}/news`); 
        } else {
          setActiveCategoryProducts([]);
          setActiveCategoryNews([]);
        }
      }
    }
  }, [activeCategoryId,navigate]); 

  return (
    <div>
      {isLoading && <p>Loading categories...</p>}
      {errorMessage && <p>{errorMessage}</p>}
      {categories.map(category => (
        <RecursiveCategoryMenu
          key={category.categoryId}
          category={category}
          onCategoryClick={handleCategoryClick}
          activeCategoryId={activeCategoryId}
        />
      ))}
    </div>
  );
};

export default CategoryTree;
