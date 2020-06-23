import React, { Component } from "react";
import { Container } from "react-bulma-components";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = props => {
  return (
    <Container>
      <Carousel id="main-carousel" className="animated fadeIn">
        <Carousel.Item>
          <img
            className="d-block w-100 carousel-img"
            src="/images/1.jpg"
            alt="First slide"
          />
          <Carousel.Caption>
            <Link to="/reservation" className="home-button">
              Book now
            </Link>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100 carousel-img"
            src="/images/2.jpg"
            alt="Third slide"
          />

          <Carousel.Caption>
            <Link to="/reservation" className="home-button">
              Book now
            </Link>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100 carousel-img"
            src="/images/3.jpg"
            alt="Third slide"
          />

          <Carousel.Caption>
            <Link to="/reservation" className="home-button">
              Book now
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </Container>
  );
};

export default Home;
