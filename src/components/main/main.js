import React, { Component } from "react";
import request from "utils/request";
import styles from "./main.module.css";
import environment from ".env.js";
import Moment from "moment";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
			near_earth_objects: [],
			mars_photos: []
    };
  }

  componentDidMount() {
		this.fetchNearEarthObjects();
		this.fetchMarsPhotos();
	}

	getTodayFormattedDate() {
		const today = new Date();
		const formattedDate = Moment(today).format("YYYY-MM-DD");
		return formattedDate;
	}

  async fetchNearEarthObjects() {
    try {
      this.setState({
        near_earth_objects: [],
      });

      const formattedDate = this.getTodayFormattedDate();
      const data = await request(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${formattedDate}&end_date=${formattedDate}&api_key=${environment.api_key}`
			);
			
      this.setState({
        near_earth_objects: data.near_earth_objects[formattedDate],
      });
    } catch (error) {
      console.error(error);
    }
	}
	
  async fetchMarsPhotos() {
    try {
      this.setState({
        mars_photos: [],
			});

      const data = await request(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2015-6-3&api_key=${environment.api_key}`
			);

			console.log(data.photos);
      this.setState({
        mars_photos: data.photos
      });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <main className={styles["content"]}>
				<h2>Mars Rover Photos</h2>
				<div className={styles["mars-cards-container"]}>
					{
						this.state.mars_photos.map((element) => {
							return (
								<div className={styles["mars-card"]} key={element.id}>
									<img src={element.img_src} alt="mars"/>
								</div>
							);
						})
					}
				</div>


        <h2>Near Earth Objects</h2>
				<div className={styles["object-cards-container"]}>
					{
						this.state.near_earth_objects.slice(0,5).map((element) => {
							return (
								<div className={styles["object-card"]} key={element.id}>
									<h3>{element.name}</h3>
									<p><strong>ID:</strong> {element.id}</p>
									<p><strong>Diameter:</strong> {Math.round(element.estimated_diameter.meters.estimated_diameter_max)} m</p>
									<p><strong>Distance:</strong> {Math.round(element.close_approach_data[0].miss_distance.kilometers)} Km</p>
								</div>
							);
						})
					}
				</div>



      </main>
    );
  }
}

export default Main;
