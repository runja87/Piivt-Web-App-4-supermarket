import React from 'react';
import ICategory from '../../models/ICategory.model';


interface SingleCategoryParams {
  category: ICategory;
}


interface MultipleCategoriesParams {
  categories: ICategory[];
}



const RecursiveCategoryMenu: React.FC<SingleCategoryParams>  = ({ category }) => {
  return (
    <div style={{marginLeft: category.parentCategoryId ? 20 : 0}}>
      <p>{category.name}</p>
      {category.threeLevelStructure.length > 0 && (
        <div>
          {category.threeLevelStructure.map(subCategory => (
            <RecursiveCategoryMenu key={subCategory.categoryId} category={subCategory} />
          ))}
        </div>
      )}
    </div>
  );
};

export const CategoryTree: React.FC<MultipleCategoriesParams>  = ({ categories }) => {
  return (
    <div>
      {categories.map(category => (
        <RecursiveCategoryMenu key={category.categoryId} category={category} />
      ))}
    </div>
  );
};
export default RecursiveCategoryMenu;