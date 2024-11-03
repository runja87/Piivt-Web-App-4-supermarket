import React, { useState, memo } from 'react';
import ICategory from '../../models/ICategory.model';
import './RecursiveCategoryMenu.sass';

interface SingleCategoryParams {
  category: ICategory;
  onCategoryClick: (category: ICategory) => void;
  activeCategoryId: string | null;
}

const RecursiveCategoryMenu: React.FC<SingleCategoryParams> = memo(({ category, onCategoryClick, activeCategoryId }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const isActive = String(category.categoryId) === activeCategoryId;

  const handleCategoryClick = () => {
    setIsExpanded(prev => !prev);
    onCategoryClick(category);
  };

  return (
    <div className={`category-menu ${isActive ? 'active' : ''}`} style={{ marginLeft: category.parentCategoryId ? 20 : 0 }}>
  <p
    onClick={handleCategoryClick}
    aria-expanded={isExpanded ? 'true' : 'false'}
    aria-controls={`category-${category.categoryId}`}
    role="button"
  >
    {category.name} {category.threeLevelStructure.length > 0 && (isExpanded ? '[-]' : '[+]')}
  </p>
  {isExpanded && category.threeLevelStructure.length > 0 && (
    <div className="sub-category" id={`category-${category.categoryId}`}>
      {category.threeLevelStructure.map(subCategory => (
        <RecursiveCategoryMenu
          key={subCategory.categoryId}
          category={subCategory}
          onCategoryClick={onCategoryClick}
          activeCategoryId={activeCategoryId}
        />
      ))}
    </div>
  )}
</div>
  );
});

export default RecursiveCategoryMenu;
