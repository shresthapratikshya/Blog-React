import React, { useEffect, useState } from 'react'
import { db } from '../config/firebase';
import { getDocs, collection } from 'firebase/firestore';
import '../css/home.css';
const Home = () => {
    const [display, setDisplay] = useState([]);
    const blogCollection = collection(db, "blogs"); //gets the collection from blogs database
    const displayBlogs = async () => {
        try {
            const blogData = await getDocs(blogCollection); //gives all the objects there are(unrequired)
            const filteredData = blogData.docs.map((doc) => ({ //filtering data to get only data that we need
                ...doc.data(), id: doc.id
            }));
            setDisplay(filteredData);
            setFilterBlog(filteredData);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        displayBlogs();
    }, []);

    const [filterBlog, setFilterBlog] = useState([]);
    const searchBlogs = (event) => {
        // if (!event.target.value) {
        //     return displayBlogs();
        // }
        if (event.target.value === "All") {
            displayBlogs();
        }
        else if (event.target.value === "Featured") {
            const featuredList = display.filter((blogger) =>
                blogger.category.includes("Featured"));
            setFilterBlog(featuredList);
        } else {
            const popularList = display.filter((blogger) =>
                blogger.category.includes("Popular"));
            setFilterBlog(popularList);
        }

    }

    return (
        <div className='blog-display'>
            <div className='filter'>
                <label className='filter-category'>Category</label>
                <select name="category" className='filter-list' onChange={searchBlogs} defaultValue="All">
                    <option value="All" >ALL</option>
                    <option value="Popular">POPULAR</option>
                    <option value="Featured">FEATURED</option>
                </select>
            </div>
            {filterBlog && filterBlog.map((blog) => (
                <div className='blog-section'>
                    <h1>{blog.title}</h1>
                    <h3><b className='category-display'>Category: </b>{blog.category}</h3>
                    <p>{blog.description}</p>

                </div>
            ))}
        </div>
    )
}

export default Home