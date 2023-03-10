import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import styled from "styled-components";
import CommonStyle from './style/Grobal';
import { BsX, BsArrowRight, BsArrowLeft } from "react-icons/bs";

import MovieSlide from 'react-slick';
import 'slick-carousel/slick/slick.css';

//style 

const Wapper = styled.div`
background: #474544;
`
const MovieListWrapper = styled.section`
padding: 100px 0;
`
const Inner = styled.div`
width: 1600px;
margin: 0 auto;
`
const GridLayout = styled.ul`
display: grid;
grid-template-columns: repeat(6, 1fr);
gap: 10px;

`

const GridItm = styled.li`
position: relative;
`

const Img = styled.img``

const Title = styled.strong`
position: absolute;
top: 20px;
left: 20px;
right: 20px;
color: #fff;
`
const Desc = styled.span`
position: absolute;
bottom: 0;
left: 0;
right: 0;
color: #fff;
background: rgba(0,0,0,0.5);
padding: 20px;
font-size: 14px;
min-height: 130px;
`

const Header = styled.header`
padding: 50px 0;
text-align: center;
`
const H1 = styled.h1`
margin: 0 0 10px 0;
font-size: 100px;
font-weight: 900;
color: #FFA556;
`

const MainTitle = styled.p`
margin: 0 0 30px 0;
color: #fff;
font-size: 12px;
text-transform: uppercase;
`

const Input = styled.input`
border: none;
outline: none;
border: 3px solid #ddd;
font-size: 14px;
padding: 5px;
width: 400px;
`
const Button = styled.button`
border: none;
background: #FFA556;
color: #fff;
padding: 7px 20px;
margin: 0 0 0 10px;
`
const ListBtnWrapper = styled.div`
text-align: center;
`

const ListBtn = styled.button`
border: none;
padding: 3px 10px;
margin: 0 1px;
background: #FFA556;
border-radius: 2px;

`

const MoviePopWapper = styled.div`
position: fixed;
inset:  0 0 0 0;
z-index: 999;
background: rgba(0,0,0,0.5);
`

const MoviePop = styled.div`
position: absolute;
inset: 50% auto auto 50%;
transform: translate(-50%,-50%);

display: grid;
grid-template-columns: repeat(2, 1fr);
background: #020e32;
color: #fff;

width: 800px;
`

const MoviePopDesc = styled.div`
position:relative;
display: flex;
flex-direction: column;
padding: 50px;

overflow: hidden;
`

const MoviePopDescTitle = styled.h3`
font-size: 30px;
font-weight: 700;
margin: 0 0 30px 0;
`
const MoviePopDescDesc = styled.p`
font-size: 14px;
font-weight: 300;
line-height: 1.414;
`
const MoviePopDescYear = styled.p`
margin: auto 0 10px 0;
font-size: 14px;
font-weight: 300;


`
const MoviePopDescGenres = styled.ul`
font-size: 14px;
font-weight: 500;

display: flex;
flex-wrap: wrap;
gap: 10px;
`
const Genre = styled.li``
const MovieDetailClose = styled.span`
position: absolute;
inset: 0 0 auto auto;
font-size: 30px;
padding: 10px;
background: tomato;
`

const MovieSlideWrapper = styled.div`
position: relative;
color: #fff;
margin: 0 0 30px 0;
`

const MovieSlideLeftArrow = styled.span`
position: absolute;
inset: 50% auto auto 0;
transform: translate(0,-50%);

font-size: 30px;
padding: 15px;
background: rgba(0,0,0,0.5);
`
const MovieSlideRightArrow = styled.span`
position: absolute;
inset: 50% 0 auto auto;
transform: translate(0,-50%);

font-size: 30px;
padding: 15px;
background: rgba(0,0,0,0.5);
`

const InputResult = styled.div`
margin: 20px 30px;
display: flex;
flex-wrap: wrap;
justify-content: center;
gap: 20px;
color: #ddd;
font-size: 13px;
font-weight: 300;
`


// 1. 영화 만히 가져오기... list 버튼 만들기...
// 2. 영화 클릭하면 자세한 정보 보여주기...
// 3. 영화 슬라이드 만들기 slick npm react-slick
// 4. 영화 검색기능 만들기
// 5. 장르 별로 보여주기....
// 6. 로딩중 만들기...


const DetailMovie = ({ movie, on, setOn }) => {
    const { id } = useParams();
    // 1 === '1'
    const detailMovie = movie.find(it => String(it.id) === id);
    const cover = useRef();
    //https://stackoverflow.com/questions/65455975/using-useref-addeventlistener 참조
    // Useref는 rerender를 트리거하지 않고 useEffect 이전에 바인딩된 ref 객체입니다. 요소 없이 el.current를 사용하십시오.
    const scrollHandler = e => {
        e.preventDefault()
    }
    useEffect(() => {
        if (cover.current) {
            cover.current.addEventListener('wheel', scrollHandler);
            // return () => {
            //     cover.current.removeEventListener("scroll", scrollHandler);
            // };
        }
    }, [cover.current]);

    return (
        <>
            {
                detailMovie && on &&
                <MoviePopWapper

                    ref={cover}
                >
                    <MoviePop>
                        <div>
                            <img src={detailMovie.large_cover_image} alt="" />
                        </div>
                        <MoviePopDesc>
                            <MoviePopDescTitle>{detailMovie.title}</MoviePopDescTitle>
                            <MoviePopDescDesc>{detailMovie.description_full.substr(0, 400)}</MoviePopDescDesc>
                            <MoviePopDescYear>{detailMovie.year}</MoviePopDescYear>
                            <MoviePopDescGenres>
                                {
                                    detailMovie.genres?.map((it, idx) => {
                                        return <Genre key={idx}>{it}</Genre>
                                    })
                                }
                            </MoviePopDescGenres>
                            <MovieDetailClose onClick={() => setOn(false)}><BsX /></MovieDetailClose>
                        </MoviePopDesc>
                    </MoviePop>
                </MoviePopWapper>
            }
        </>
    )
}

const SearchMovie = ({ search, on, setOn }) => {
    const { id } = useParams();
    // 1 === '1'
    const detailMovie = search?.find(it => String(it.id) === id);
    const cover = useRef();
    //https://stackoverflow.com/questions/65455975/using-useref-addeventlistener 참조
    // Useref는 rerender를 트리거하지 않고 useEffect 이전에 바인딩된 ref 객체입니다. 요소 없이 el.current를 사용하십시오.
    const scrollHandler = e => {
        e.preventDefault()
    }
    useEffect(() => {
        if (cover.current) {
            cover.current.addEventListener('wheel', scrollHandler);
            // return () => {
            //     cover.current.removeEventListener("scroll", scrollHandler);
            // };
        }
    }, [cover.current]);




    return (
        <>
            {
                detailMovie && on &&
                <MoviePopWapper

                    ref={cover}
                >
                    <MoviePop>
                        <div>
                            <img src={detailMovie.large_cover_image} alt="" />
                        </div>
                        <MoviePopDesc>
                            <MoviePopDescTitle>{detailMovie.title}</MoviePopDescTitle>
                            <MoviePopDescDesc>{detailMovie.description_full.substr(0, 400)}</MoviePopDescDesc>
                            <MoviePopDescYear>{detailMovie.year}</MoviePopDescYear>
                            <MoviePopDescGenres>
                                {
                                    detailMovie.genres?.map((it, idx) => {
                                        return <Genre key={idx}>{it}</Genre>
                                    })
                                }
                            </MoviePopDescGenres>
                            <MovieDetailClose onClick={() => setOn(false)}><BsX /></MovieDetailClose>
                        </MoviePopDesc>
                    </MoviePop>
                </MoviePopWapper>
            }
        </>
    )
}

const Movie = () => {
    //영화 데이타를 가져오기 (데이터는 시간이 걸리는 일이므로... 비동기식으로 처리한다.)
    //영화데이타를 그리기 state(리액터가 그려줄 수 있게)

    const [movie, setMovie] = useState([]);
    const [movieList, setMovieList] = useState({});
    const [pageNum, setPageNum] = useState(0);
    const [list, setList] = useState(0);
    const [on, setOn] = useState(true);
    const [search, setSearch] = useState([]);
    const [inputList, setInputList] = useState();
    const [input, setInput] = useState('');

    const mainSlide = useRef(null);
    const inputRef = useRef(null);

    const limit = 36; // 50이하임..
    const pageLimit = 20;
    const listNum = Array.from({ length: parseInt(movieList.movie_count / limit) });

    const getMovie = async () => {
        const r = await axios.get(`https://yts.mx/api/v2/list_movies.json?limit=${limit}&page=${pageNum}`);
        setMovieList(r.data.data);
        setMovie(r.data.data.movies);
    }

    const searchMovie = async () => {
        const r = await axios.get(`https://yts.mx/api/v2/list_movies.json?query_term=${inputList}`);
        setSearch(r.data.data.movies);
    }

    useEffect(() => {
        getMovie();
    }, [pageNum]);

    useEffect(() => {
        searchMovie();
    }, [inputList]);

    const searchHandler = e => {
        e.preventDefault();
        if (input.length < 3) {
            alert('더 입력하세요')
            setInput('')
            inputRef.current.focus(); //글자수 짧을때 경고창뜨고 커서 깜박이게
            return
        }
        setInputList(input);
        console.log(inputList);
    } //새로고침 막는것

    console.log(movie, movieList);

    const MainSlideOption = {
        slidesToShow: 7,
        arrows: false,
    }

    return (
        <Wapper>
            <CommonStyle />
            <Header>
                <H1>Lee's Movie</H1>
                <MainTitle>It is a site that collects my favorite movies. Enjoy it.</MainTitle>
                <form onSubmit={searchHandler}>
                    <Input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        ref={inputRef}
                    />
                    <Button>SEARCH</Button>
                </form>
                <InputResult>
                    {
                        search &&
                        search.map(it => {
                            return (
                                <Link to={`/search/${it.id}`}
                                    onClick={() => setOn(true)} 
                                    key={it.id}>
                                    {it.title}
                                </Link>
                            )

                        })

                    }
                </InputResult>
            </Header>

            {/* MovieSlide */}
            <MovieSlideWrapper>

                <MovieSlide {...MainSlideOption} ref={mainSlide}>
                    {
                        movie.map((it, idx) => {
                            return (
                                <GridItm key={it.id} onClick={() => setOn(true)}>
                                    <Link to={`/detail/${it.id}`}>
                                        <Img src={it.large_cover_image}
                                            alt={it.title}
                                            onError={e => e.target.src = `${process.env.PUBLIC_URL}/cover.jpg`}
                                        />
                                        <Title>{it.title_long}</Title>
                                        {
                                            it.summary.length > 10 &&
                                            <Desc>
                                                {it.summary.substr(0, 100)}
                                                {it.summary.length > 100 ? '...' : ''}
                                            </Desc>
                                        }
                                    </Link>

                                </GridItm>
                            )
                        })
                    }
                </MovieSlide>
                <MovieSlideLeftArrow onClick={() => mainSlide.current.slickPrev()}><BsArrowLeft /></MovieSlideLeftArrow>
                <MovieSlideRightArrow onClick={() => mainSlide.current.slickNext()}><BsArrowRight /></MovieSlideRightArrow>

            </MovieSlideWrapper>



            <Routes>
                <Route path="/" element={null} />
                <Route path="/detail/:id" element={
                    <DetailMovie
                        movie={movie}
                        on={on}
                        setOn={setOn} />
                } />
                <Route path="/search/:id" element={
                    <SearchMovie
                        search={search}
                        on={on}
                        setOn={setOn} />
                } />
            </Routes>



            <ListBtnWrapper>
                {
                    list > 1 &&
                    <ListBtn onClick={() => setList(list - pageLimit)}>PREV</ListBtn>
                }

                {
                    listNum.map((_, idx) => {
                        return <ListBtn onClick={() => setPageNum(idx + 1)} key={idx}>{idx + 1}</ListBtn>
                    }).slice(list, list + pageLimit)
                }
                {
                    list < parseInt(movieList.movie_count / limit) - pageLimit &&
                    <ListBtn onClick={() => setList(list + pageLimit)}>NEXT</ListBtn>
                }
            </ListBtnWrapper>

            <MovieListWrapper>
                <Inner>
                    <GridLayout>
                        {
                            movie.map((it, idx) => {
                                return (
                                    <GridItm key={it.id} onClick={() => setOn(true)}>
                                        <Link to={`/detail/${it.id}`}>
                                            <Img src={it.large_cover_image}
                                                alt={it.title}
                                                onError={e => e.target.src = `${process.env.PUBLIC_URL}/cover.jpg`}
                                            />
                                            <Title>{it.title_long}</Title>
                                            {
                                                it.summary.length > 10 &&
                                                <Desc>
                                                    {it.summary.substr(0, 100)}
                                                    {it.summary.length > 100 ? '...' : ''}
                                                </Desc>
                                            }
                                        </Link>

                                    </GridItm>
                                )
                            })
                        }
                    </GridLayout>
                </Inner>

            </MovieListWrapper>
        </Wapper>
    )
}

export default Movie;