// Libaries
import React, { Component } from "react";
import axios from "axios";
// Components
import Loading from "../Loading/Loading";
import Post from "../Post/Post";
import SearchBar from "../SearchBar/SearchBar";

export default class AllPosts extends Component{

    state = {
        postData: [],
        dataFetched: false,
        filterValue: ""
    } 

    getPosts = () => {
        const { api_url, categoryToRender: categoryID } = this.props;
        const trimmedURL = api_url.split("wp-json")[0];
        const fetchParams = `wp-json/wp/v2/posts?categories=${categoryID}&_embed`;
        const fetchURL = `${trimmedURL}${fetchParams}`;
        axios.get(fetchURL)
        .then(res => {
            this.setState({
                postData: res.data,
                dataFetched: true
            })
        })
    }    

    componentDidMount(){
        document.addEventListener("keyup", (event) =>{
            if(event.key === "Escape"){
                this.handleClearSearchBox();
            }
        } )
    }

    // attached to the escape key using componentDidMount()
    handleClearSearchBox = () => {
        this.setState({filterValue: ""})
    }

    stripHTML = (indexOrData) => {
        let rawData;

        if(Number.isInteger(indexOrData)){
            rawData = this.state.postData[indexOrData].excerpt.rendered;
        }else{
            rawData = indexOrData;
        }
        return new DOMParser()
          .parseFromString(rawData, 'text/html')
          .body
          .textContent
          .trim()
      }

      prevToggled = () => {
          console.log("Previous toggled");
      }

      nextToggled = () => {
          console.log("Next toggled");
      }

      filterChangeHandler = e => this.setState({ filterValue: e.target.value.toUpperCase()});

      filterItems(){
        const { postData, filterValue } = this.state;
        let sortedFilteredPosts = postData.filter(({ title }) => title.rendered.includes(filterValue));
        console.log(sortedFilteredPosts)
        return sortedFilteredPosts;
      }

render(){

    if(!this.state.dataFetched && this.props.categoryToRender !== null){
        this.getPosts();
        return(
            <div>
                <Loading />
            </div>
        )
    }

    if(this.state.dataFetched && this.state.postData.length === 0){
        return(
            <div className="noPostsFound">
                <h1 >No Posts Found! :(</h1>
                <p>Please visit <strong>Settings/Uneek Gallery</strong> from the dashboard and check the category selected.</p>
            </div>
        )
    }

    if(this.state.filterValue !== ""){
        return(
            <div>
                <div className="uneekGallerySearchBarContainer">
                    <SearchBar value={this.state.filterValue} onChange={this.filterChangeHandler}/>
                </div>
            {/* filtered film results */}
            {this.filterItems().map((post, index) => <Post
                key={this.filterItems()[index].id === undefined ? null : this.filterItems()[index].id}
                filmTitle={this.filterItems()[index].title.rendered === undefined ? null : this.filterItems()[index].title.rendered.toUpperCase()}
                filmExcerpt={this.stripHTML(this.filterItems()[index]) === undefined ? null : this.stripHTML(this.filterItems()[index].excerpt.rendered)}  
                filmImage={this.filterItems()[index]._embedded['wp:featuredmedia'] === undefined ? null : this.filterItems()[index]._embedded['wp:featuredmedia'][0].source_url}
                filmLink={this.filterItems()[index].link === undefined ? null : this.filterItems()[index].link}
            />)}
            </div>
        )
    }


    return(
        <div>
        {this.props.showSearchBar ? <div className="uneekGallerySearchBarContainer"><SearchBar value={this.state.filterValue} onChange={this.filterChangeHandler}/></div> : null}
        {this.state.postData.map((post, index) => <Post
            key={this.state.postData[index].id === undefined ? null : this.state.postData[index].id}
            filmTitle={this.state.postData[index].title.rendered === undefined ? null : this.state.postData[index].title.rendered.toUpperCase()}
            filmExcerpt={this.stripHTML(index) === undefined ? null : this.stripHTML(index)}    
            filmImage={this.state.postData[index]._embedded['wp:featuredmedia'] === undefined ? null : this.state.postData[index]._embedded['wp:featuredmedia'][0].source_url}
            filmLink={this.state.postData[index].link === undefined ? null : this.state.postData[index].link}
        />)}
            <div className="nextPrevBar">
                <div className="nextPrevLinks">
                    <a
                    onClick={this.prevToggled}
                    >PREV</a>
                </div>
                <div className="nextPrevLinks">
                    <a
                    onClick={this.nextToggled}
                    >NEXT</a>
                </div>
            </div>
        </div>
    )
}

}