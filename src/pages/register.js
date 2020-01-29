import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import RegistrationForm from "../components/registration/registrationForm"

const IndexPage = () => (
  <Layout>
    <SEO title="Fall 2019 Korean Class Registration" />
    {/* <h1>Fall 2019 Korean Class</h1> */}
    <RegistrationForm />
    <Link to={'/'}>Home</Link>
  </Layout>
)

export default IndexPage
