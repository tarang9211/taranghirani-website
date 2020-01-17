import React from 'react';

const BlogTemplate = (props) => {
  return (
    <div>Tempate</div>
  );
};

BlogTemplate.getInitialProps = async (context) => {
  const { query: { slug } } = context;
  console.log(query);
  return 'test'
}

export default BlogTemplate;