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

  const sectionTemplate = path.resolve(`./src/templates/translation-section.js`)

  const result = await graphql(
    `
      {
        allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/\\/translation\\//"}}) {
          edges {
            node {
              frontmatter {
                title
                date
                pageNumber
                chapter {
                  number
                  en
                  ko
                }
                part {
                  number
                  en
                  ko
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

  // const bookOrder = (a,b) => (a.node.frontmatter.part.number * 100 + a.node.frontmatter.chapter.number) - (b.node.frontmatter.part.number * 100 + b.node.frontmatter.chapter.number)

  
  const sections = mapRawPostsToSections(result.data.allMarkdownRemark.edges)

  // generate page for each section
  sections.forEach((section, i) => {
    console.log(`>>> creating page for translation section ${i}, ${section.titleEn} : ${section.chapters.length} chapters`)
    createPage({
      path: `practice-returning-to-god/` + section.titleEn.toLowerCase().split(',')[0].replace(/ /g,'-'),
      component: sectionTemplate,
      context: {...section},
    })
  })
  
  // generate index page




  function mapRawPostsToSections(posts) {
    const sections = {}
    for (let post of posts) {
      const fm = post.node.frontmatter
      
      // handle the section metadata
      const key = fm.part.number
      if (!sections[key]) {
        sections[key] = {
          titleEn: fm.part.en,
          titleKo: fm.part.ko,
          chapters: [],
        }
      }
      
      // add the post to correct section
      sections[key].chapters.push({
        chapter: fm.chapter.number,
        titleEn: fm.chapter.en,
        titleKo: fm.chapter.ko,
        page: fm.pageNumber,
        isPublished: !fm.draft,
        html: post.node.html,
        date: fm.date,
      })
    }

    const output = []
    const keys = Object.keys(sections).sort()
    for (let key of keys) {
      sections[key].chapters.sort((a,b) => b.chapter - a.chapter)
      output.push(sections[key])
    }
    return output
  }
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
