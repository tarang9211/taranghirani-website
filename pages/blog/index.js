import React from 'react';
import Link from 'next/link';
import matter from 'gray-matter';
import Container from '../../components/container';

const BlogIndex = (props) => {
  const { posts } = props;
  return (
    <Container>
      <div className="max-w-md flex ml-auto mr-auto mt-20">
        {
          posts.map(({ slug, document }) => {
            const { data: { title, date } } = document;
            return (
              <section key={slug}>
                <Link href={`/blog/${slug}`}>
                  <a className="font-mono antialiased text-2xl text-teal-300">
                    {title}
                  </a>
                </Link>
              </section>
            )
          })
        }
      </div>
    </Container>
  );
};

BlogIndex.getInitialProps = async (ctx) => {
  console.log(ctx);
  const context = require.context('../../posts', true, /\.md/)
  const keys = context.keys();
  const values = keys.map(context);

  const posts = keys.map((key, index) => {
    const slug = key.replace(/^.*[\\\/]/, '').split('.').slice(0, -1).join('.');
    return {
      slug,
      document: matter(values[index].default)
    };
  });
 return { posts } 
};

export default BlogIndex;

