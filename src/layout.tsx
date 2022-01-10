import { GlobalStyle } from '@centrifuge/fabric'
import { MDXProvider } from '@mdx-js/react'
import * as Gatsby from 'gatsby'
import React, { memo } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { Box, BoxProps, Image, Paragraph, Text, shortcodes } from './components'
import { SEO } from './components/SEO'
import { theme } from './theme'
import { ModalProvider } from 'react-modal-hook'

// Providers
type Decorator<R = unknown> = <P>(Component: React.ComponentType<P>) => React.FC<R & P>

const withMDXProvider: Decorator = (Component) => (rest) =>
  (
    <MDXProvider components={shortcodes}>
      <Component {...rest} />
    </MDXProvider>
  )

const withThemeProvider: Decorator = (Component) => (props) =>
  (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyle />
        <Component {...props} />
      </>
    </ThemeProvider>
  )

const withModalProvider: Decorator = (Component) => (props) =>
  (
    <ModalProvider>
      <Component {...props} />
    </ModalProvider>
  )

interface PageContext {
  frontmatter: NodeJS.Dict<any>
}

const withSEO: Decorator<Gatsby.PageProps<unknown, PageContext>> = (Component) => (props) => {
  const { title, description, image, article } = props.pageContext.frontmatter

  return (
    <SEO title={title} description={description} image={image} article={article}>
      <Component {...props} />
    </SEO>
  )
}

function enhance<P>(component: React.ComponentType<P>) {
  return withSEO(withThemeProvider(withMDXProvider(withModalProvider(memo(component)))))
}

// Layout

export const Header = styled((props: BoxProps) => <Box as="header" minHeight="header" p={[2, 3, 4]} {...props} />)`
  grid-area: head;
`

export const Footer = styled((props: BoxProps) => <Box as="footer" mb="20px" p={[2, 3, 4]} {...props} />)`
  grid-area: foot;
`

export const Main = styled((props: BoxProps) => <Box as="main" overflow="hidden" px={[2, 3, 4]} {...props} />)`
  grid-area: main;
`

export const Sidebar = styled((props: BoxProps) => <Box as="aside" {...props} />)`
  grid-area: side;
`

export const Layout = styled((props: BoxProps) => <Box maxWidth="container" mx="auto" {...props} />)`
  display: flex;
  flex-direction: column;

  ${({ theme }) => `${theme.mediaQueries.large} {
    display: grid;
    grid:
      \". head . side\"
      \". main . side\"
      \". foot . side\";
    grid-template-columns: 1fr auto 1fr 260px
  }`}
`

const DefaultHeader: React.FC = () => (
  <Header>
    <Image
      src={
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require(`./images/kfactory-logo.svg`).default
      }
      height={87}
    />
  </Header>
)

const DefaultFooter: React.FC = () => (
  <Footer mb="24px">
    <Paragraph textAlign="center" my={0}>
      k-f dev AG, Grafenauweg 8, 6300 Zug,
      <br />
      Switzerland
    </Paragraph>
  </Footer>
)

export const DefaultLayout = enhance(({ children, ...rest }) => (
  <Layout {...rest}>
    <DefaultHeader />
    <Main>{children}</Main>
    <DefaultFooter />
  </Layout>
))

export const withSidebar = (sidebar: React.ReactNode) =>
  enhance(({ children, ...rest }) => (
    <Layout {...rest}>
      <DefaultHeader />
      <Main>{children}</Main>
      {sidebar}
      <DefaultFooter />
    </Layout>
  ))
