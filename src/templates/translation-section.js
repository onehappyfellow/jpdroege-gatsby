import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"

class TranslationSection extends React.Component {
  render() {
    const { chapters, titleEn, titleKo } = this.props.pageContext

    return (
      <Layout location={this.props.location} title="Test">
        <h1>{titleEn}</h1>
        {chapters.map(ch => (
          <p>{ch.titleEn}</p>
        ))}
      </Layout>
    )
  }
}

export default TranslationSection

// const pageQuery = graphql`
//   query BlogPostBySlug($slug: String!) {
//     site {
//       siteMetadata {
//         title
//       }
//     }
//     markdownRemark(fields: { slug: { eq: $slug } }) {
//       id
//       excerpt(pruneLength: 160)
//       html
//       frontmatter {
//         title
//         date(formatString: "MMMM DD, YYYY")
//         description
//       }
//     }
//   }
// `
