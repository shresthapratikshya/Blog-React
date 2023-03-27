import React, { useEffect, useState } from 'react'
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import '../css/home.css';

const Home = () => {
    const [display, setDisplay] = useState([]);
    const [filterBlog, setFilterBlog] = useState([]);

    const blogCollection = collection(db, "users-blog"); //gets the collection from blogs database
    const displayBlogs = async () => {
        try {
            const blogData = await getDocs(blogCollection); //gives all the elements there are(unrequired)
            const filteredData = blogData.docs.map((doc) => ({ //filtering data to get only data that we need
                ...doc.data(), id: doc.id
            }));
            setDisplay(filteredData);
            setFilterBlog(filteredData);
        } catch (error) {
            console.log(error);
        }
        // onSnapshot(collection(db, "users-blog"), (snapshot) => {
        //     let list = [];
        //     snapshot.docs.forEach((doc) => {
        //         list.push({ id: doc.id, ...doc.data() })
        //     });
        //     setDisplay(list);
        //     setFilterBlog(list);
        // }, (error) => {
        //     console.log("Error while displaying blogs ", error);
        // })

    }

    useEffect(() => {
        displayBlogs();
    }, []);

    const searchBlogs = (event) => {
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
                <div className='blog-section' key={blog.id}>
                    <h1>{blog.title}</h1>
                    <h3><b className='category-display'>Category: </b>{blog.category}</h3>
                    <div className='content-section'>
                        <img src={blog.image}></img>
                        <p>{blog.description}</p>
                    </div>

                </div>
            ))}
        </div>
    )
}

export default Home