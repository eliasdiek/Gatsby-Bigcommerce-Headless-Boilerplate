import React from 'react';
import { Link, graphql, StaticQuery } from 'gatsby';
import github from '../img/github-icon.svg';
import logo from '../img/logo-header.png';

import CartContext from '../context/CartProvider';

const Navbar = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      navBarActiveClass: ''
    };
  }

  toggleHamburger = () => {
    // toggle the active boolean in the state
    this.setState(
      {
        active: !this.state.active
      },
      // after state has been updated,
      () => {
        // set the class in state for the navbar accordingly
        this.state.active
          ? this.setState({
              navBarActiveClass: 'is-active'
            })
          : this.setState({
              navBarActiveClass: ''
            });
      }
    );
  };

  render() {
    // console.log('[GraphQL]', this.props);

    return (
      <nav
        className="navbar is-transparent"
        role="navigation"
        aria-label="main-navigation">
        <div className="container">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item" title="Logo">
              <img src={logo} alt="My Store" />
            </Link>
            {/* Hamburger menu */}
            <div
              className={`navbar-burger burger ${this.state.navBarActiveClass}`}
              data-target="navMenu"
              onClick={() => this.toggleHamburger()}>
              <span />
              <span />
              <span />
            </div>
          </div>
          <div
            id="navMenu"
            className={`navbar-menu ${this.state.navBarActiveClass}`}>
            <div className="navbar-start has-text-centered">

              { this.props.cats.edges && (
                  this.props.cats.edges.map((cat) => {
                    let catItem = JSON.parse(cat.node.internal.content);
                    
                    // console.log('[slug]', slug);

                    if(catItem.children.length > 0) {
                      return (
                        <div className="nav-item-wrapper has-sub" key={catItem.id}>
                          <Link className="navbar-item" to={catItem.url}>
                            {catItem.name}

                            <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 6L0.214286 1.21429C-0.0714286 0.928571 -0.0714286 0.5 0.214286 0.214286C0.5 -0.0714286 0.928572 -0.0714286 1.21429 0.214286L5 4L8.78572 0.214286C9.07143 -0.0714286 9.5 -0.0714286 9.78572 0.214286C10.0714 0.5 10.0714 0.928571 9.78572 1.21429L5 6Z" fill="#303F56"/>
                            </svg>
                          </Link>
                          <div className="sub-menu">
                            {
                              catItem.children.map((child) => {
                                return <Link className="navbar-item" to={child.url} key={child.id}>{ child.name }</Link>
                              })
                            }
                          </div>
                        </div>
                      )
                    }
                    else {
                      return (
                        <div className="nav-item-wrapper" key={catItem.id}>
                          <Link className="navbar-item" to={catItem.url}>
                            {catItem.name}
                          </Link>
                        </div>
                      )
                    }

                  })
              ) }

              <CartContext.Consumer>
                {value => {
                  return (
                    <div className="nav-item-wrapper">
                      <Link className="navbar-item menu-item-bigcommerce-cart" to="/cart">
                        Cart
                        
                        {value &&
                          value.state.cart &&
                          value.state.cart.numberItems > 0 && (
                            <span className="bigcommerce-cart__item-count full">{value.state.cart.numberItems}</span>
                          )}
                      </Link>
                    </div>
                  );
                }}
              </CartContext.Consumer>
            </div>
            <div className="navbar-end has-text-centered">
              <a
                className="navbar-item"
                href="https://github.com/bigcommerce/gatsby-bigcommerce-netlify-cms-starter"
                target="_blank"
                rel="noopener noreferrer">
                <span className="icon">
                  <img src={github} alt="Github" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    );
  }
};

export default () => (
  <StaticQuery
    query={
      graphql`
      query {
        allBigCommerceCategoriesTree {
          edges {
            node {
              name
              id
              bigcommerce_id
              url
              internal {
                content
              }
            }
          }
        }
      }
      `
    }

    render = {(data) => (
      <Navbar cats={data.allBigCommerceCategoriesTree} />
    )}
  />
)
