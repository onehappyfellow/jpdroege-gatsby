const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })
}

exports.createPages = async ({ graphql, actions }) => {
  // TODO make this actually create pages rather than just logging the output
  const { createPage } = actions

  const translationPost = path.resolve(`./src/templates/blog-post.js`)

  const result = await graphql(
    `
      {
        allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/\\/translation\\//"}}) {
          edges {
            node {
              frontmatter {
                title
                chapter {
                  number
                  en
                }
                part {
                  en
                  number
                }
                draft
              }
              html
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  const isPublished = p => !p.node.frontmatter.draft
  const bookOrder = (a,b) => (a.node.frontmatter.part.number * 100 + a.node.frontmatter.chapter.number) - (b.node.frontmatter.part.number * 100 + b.node.frontmatter.chapter.number)

  // Create blog posts pages.
  const allPosts = result.data.allMarkdownRemark.edges
  const publishedPosts = allPosts.filter(isPublished).sort(bookOrder)
  const allParts = publishedPosts.reduce((posts, post) => {
    let part = post.node.frontmatter.part;
    if (!posts[part.number]) {
      posts[part.number] = {
        title: part.en,
        chapters: [],
      }
    }
    posts[part.number].chapters.push({
      title: post.node.frontmatter.chapter.en
    })
    return posts
  },{})


  allPosts.forEach((post, index) => {
    console.log(`part ${post.node.frontmatter.part.number} chapter ${post.node.frontmatter.chapter.number}`)
    // const previous = index === posts.length - 1 ? null : posts[index + 1].node
    // const next = index === 0 ? null : posts[index - 1].node

    // createPage({
    //   path: post.node.fields.slug,
    //   component: blogPost,
    //   context: {
    //     slug: post.node.fields.slug,
    //     previous,
    //     next,
    //   },
    // })
  })

  publishedPosts.forEach((post, index) => {
    console.log(`index ${index} : part ${post.node.frontmatter.part.number} chapter ${post.node.frontmatter.chapter.number}`)
  })

  const keys = Object.keys(allParts)
  keys.forEach(key => {
    console.log(allParts[key])
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
