import React,{useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import Header from './common/Header';
import Footer from './common/Footer';
import Movie from './components/Movie';
import Conditions from './components/Conditions';
import GlobalStyles from './GlobalStyles';
import styled from 'styled-components';
import palette from './lib/palette';


const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 3rem auto;
  height: 10rem;
`

const MainWrapper = styled.section`
    border-top: 1px solid ${palette['fontStrongColor']};
    border-bottom: 1px solid ${palette['fontStrongColor']};
    height: auto;
`

const App = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [movies, setMovies] = useState(null);
  const [date, setDate] = useState('');
  const [nation, setNation] = useState(null);
  const [posters, setPosters] = useState([]);
  const [names, setNames] = useState(null);



  const getMovies = async (DATE) => {
    
    try {
      setMovies(null);
      setLoading(true);
      const {
        data: {
          boxOfficeResult: {dailyBoxOfficeList}
        }
      } = await axios.get(`http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=4010de0e4173634fe5b671b20aea7c21&targetDt=${DATE}&repNationCd=${nation}`);
      setMovies(dailyBoxOfficeList);

      // dailyBoxOfficeList = [{rnum:'', rank:'', rankOldAndNew:'', movieNm: '원더우먼'}]
      // titles = ['원더우먼', '화양연화','조제','소울','도굴', ...]
      const TitleAndDates = dailyBoxOfficeList.map(movie => ({name: movie.movieNm, date: movie.openDt}))


      // GetPosterImg();
      console.log(`TitleAndDates: ${TitleAndDates}`);
    }catch(e){
      setError(true);
      console.log('에러 원인:',e);
    }

    setLoading(false);
  };
  
  useEffect(()=> {
    // if(date)
    //   getMovies();
  }, []);


  // const GetPosterImg = async() => {

  //   // 개봉일 날짜를 8자리 수로 변환하는 코드 필요
  //   // 검색 조건 : 제목, 개봉일

  //   const USER_KEY = '9J3U3PF6Q9127H323N04';
  //     const image = await axios.get(`http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&detail=N&title=7광구&ServiceKey=${USER_KEY}`)
  //     // console.log('image.data.Data[0].Result[1].rating:',image.data.Data[0].Result[1].posterUrl);
  //     console.log(image);
  // }

  const DateHandler = useCallback(e => {
      let inputDate ='';
      inputDate = e.target.value;
      inputDate.length === 8 || (parseInt(inputDate) || inputDate === '') ?
        setDate(e.target.value):alert('숫자 형식으로 입력해주세요!') && setDate('')
  }, []);

  const SearchExcute = useCallback((e) => {
    if (date.length === 8 && nation !== null) 
      getMovies(date)
    else if (date.length !== 8 && nation !== null) 
      alert('입력하신 날짜를 확인해주세요.')
    else
      alert('검색할 국가를 선택해주세요.')
  }, [date,nation])

  
  const NationHandler = useCallback(e => {
    const {target: {attributes: {value: {value}}}} = e;
    let Nation = value === 'K'? setNation('K') : setNation('F');
    return Nation;
  }, []);


  return (
    <div className='container'>
      <GlobalStyles/>
      <Header/>
      <Conditions 
          date={date} 
          nation={nation} 
          dateHandler={DateHandler} 
          nationHandler={NationHandler} 
          SearchExcute={SearchExcute} 
      />
      <MainWrapper>
        {movies?
            (<div className="movies">
              {movies.map(movie=> (
                <Movie title={movie.movieNm} 
                      id={movie.movieCd}
                      key={movie.movieCd} 
                      openDt={movie.openDt}  
                      rank={movie.rank}  
                      rankOldAndNew={movie.rankOldAndNew}  
                      audiAcc={movie.audiAcc}
                />
              ))}
            </div>):
            loading? 
              (
                <LoaderWrapper>
                  데이터를 불러오는 중..
                </LoaderWrapper>) :
              (
                <LoaderWrapper>
                  검색 조건을 설정해주세요.
                </LoaderWrapper>
              )
        }
        
      </MainWrapper>


      <Footer/>
    </div>
  );
};

export default App;