import React from 'react';

const PageTitle = ({
  title,
  subTitle,
  splitor = '/'
}) => {
  return <div className="page-title__wrapper">
      <span className="page-title__title">{title}</span>
      {subTitle && <>
            <span className="page-title__splitor">{splitor}</span>
            <span className="page-title__subtitle">{subTitle}</span>
          </>}
    </div>;
};

export default React.memo(PageTitle);