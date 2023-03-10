import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import styled from "styled-components";
import CommonStyle from './style/createGlobalStyle';

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
min-height: 150px;
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

const MoviePopWrapper = styled.div`
position: fixed;
inset: 0 0 0 0;
z-index: 999;
background: rgba(0,0,0,0.5);
`

const MoviePop = styled.div`
position: absolute;
inset: 50% auto auto 50%;
transform: translate(-50%,-50%);
`



// 1. 영화 만히 가져오기... list 버튼 만들기...
// 2. 영화 클릭하면 자세한 정보 보여주기...
// 3. 영화 슬라이드 만들기
// 4. 영화 검색기능 만들기
// 5. 장르 별로 보여주기....
// 6. 로딩중 만들기...


const DetailMovie = ({ movie, on, setOn }) => {
    const { id } = useParams();
    const detailMovie = movie.find(it => it.id == id);

    const wheelStop = e => {
        e.preventDefault();
    }

    const bg = useRef(null);

    useEffect(() => {
        bg.current.addEventListener('wheel', wheelStop)
    }, [id])

    return (
        <>
            {
                detailMovie && on &&
                <MoviePopWrapper
                    onClick={() => setOn(false)}
                    // onWheel={wheelStop}
                    ref={bg}
                >
                    <MoviePop>
                        <img src={detailMovie.large_cover_image} alt="" />
                    </MoviePop>
                </MoviePopWrapper>
            }
        </>
    )
}


const Movie = () => {
    //영화 데이타를 가져오기 (데이터는 시간이 걸리는 일이므로... 비동기식으로 처리한다.)
    //영화데이타를 그리기 state(리액터가 그려줄 수 있게)

    const [movie, setMovie] = useState([]);
    //초기값이 없어서 에러 뜨는것 방지 useState([]);-> []넣음 배열이면 [] 객체면 {}
    const [movieList, setMovieList] = useState({});
    const [pageNum, setPageNum] = useState(0);
    const [list, setList] = useState(0);
    const [on, setOn] = useState(true);

    const limit = 30; // 50이하임..
    const pageLimit = 20;
    const listNum = Array.from({ length: parseInt(movieList.movie_count / limit) });
    //페이지 버튼 1000개 만드는 방법  ---> movie_count: 48908 / limit
    //parseInt -> 소수점 x 정수로 만드는

    const getMovie = async () => {
        //axios==fetch axios는 .json 해줄필요없다
        const r = await axios.get(`https://yts.mx/api/v2/list_movies.json?limit=${limit}&page=${pageNum}`);
        setMovieList(r.data.data);
        //.json 안쳐주는 대신 .data를 적어줘야함
        setMovie(r.data.data.movies);
    }

    useEffect(() => {
        getMovie();
    }, [pageNum]);
    //useEffect 데이터 가져오는걸 한번만 실행하라 [] 아무것도 없으면 1번실행, [pageNum] 넣으면 바뀔때 마다 실행



    console.log(movie, movieList)

    return (
        <Wapper>
            <CommonStyle />
            <Header>
                <H1>Lee's Movie</H1>
                <MainTitle>It is a site that collects my favorite movies. Enjoy it.</MainTitle>
                <form>
                    <Input type="text" /><Button>SEARCH</Button>
                </form>
            </Header>

            <Routes>
                <Route path="/" element={null} />
                <Route path="/detail/:id" element={
                <DetailMovie movie={movie} on={on} setOn={setOn} />
                } />
            </Routes>



            <ListBtnWrapper>
                {
                    list > 1 &&
                    <ListBtn onClick={() => setList(list - pageLimit)}>PREV</ListBtn>
                }
                {
                    listNum.map((_, idx) => {
                        return <ListBtn onClick={() => setPageNum(idx + 1)}>{idx + 1}</ListBtn>
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
                                                 //사진없을때 대체하는 이미지 넣기
                                            />
                                            <Title>{it.title_long}</Title>
                                            {
                                                it.description_full.length > 10 &&
                                                <Desc>
                                                    {it.description_full.substr(0, 200)}
                                                    {it.description_full.length > 200 ? '...' : ''}
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

//https://yts.mx/api 영화 데이터