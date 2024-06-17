/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import jsQR from "jsqr";
import { faChevronCircleLeft, faChevronCircleRight, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useHistory, useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import "react-slideshow-image/dist/styles.css";
import "react-slideshow-image/dist/styles.css";
import { CheckLevelCashBack, DataLoginInRout, FillerCategory, OpenNewTabWithHTML, formatMontYear, EncriptBase64 } from "../../helper";
import Constant, { AGENT_CODE } from "../../constant";
import { BackList } from "../../constant/bankList";
import { SlideDemo } from "../../constant/demoSlide";
import _LoginController from "../../api/login";
import QRCode from "qrcode.react";
import Roulette from "../../component/Roulette";
import toast, { Toaster } from "react-hot-toast";
import Translate from "../../component/Translate";
import { useTranslation } from "react-i18next";

export default function AfterLogin() {
  const history = useHistory();
  const { t } = useTranslation();
  const UseParams = useParams();
  const user = localStorage.getItem(Constant?.LOGIN_TOKEN_DATA);
  const sidebarUseRef = useRef(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarAnimation, setSidebarAnimation] = useState(true);
  const [tabs, setTabs] = useState(t("DepositHistory"));
  const [tabName, setTabName] = useState("tab-deposit");
  const [tabNameAffiliate, setTabNameAffiliate] = useState("overview");
  const [reMessage, setReMessage] = useState("");
  const [maxLevel, setmaxLevel] = useState();
  const [historyCashBack, setHistoryCashBack] = useState([]);
  const [dataPromotion, setDataPromotion] = useState([]);
  const [disableArrow, setDisableArrow] = useState(false);
  const { ChangePassword, loginPlayNow } = _LoginController();
  const [dataFromLogin, setDataFromLogin] = useState({});
  const [dataGameList, setDataGameList] = useState();
  const [categoryGame, setCategoryGame] = useState([]);
  const [deviceType, setDeviceType] = useState(false);
  const [dataGameType, setDataGameType] = useState("SLOT"); // FAVORITE || HOTHIT
  const [dataUser, setDataUser] = useState();
  const [dataHistoryDeposit, setDataHistoryDeposit] = useState([]);
  const [dataHistoryBonus, setDataHistoryBonus] = useState([]);
  const [dataHistoryWithdraw, setDataHistoryWithdraw] = useState([]);
  const [depositBankList, setDepositBankList] = useState();
  const [current, setCurrent] = useState(0);
  const [sliderData, setSliderData] = useState([]);
  const [percentageData, setPercentageData] = useState([]);

  const [show, setShow] = useState(false);
  const [showCupong, setShowCupong] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleShowCupong = () => setShowCupong(true);
  const handleCloseCupong = () => setShowCupong(false);

  const [oldPassword, setOldPassword] = useState("");
  const [NewPassword, setNewPassword] = useState("");
  const [NewPasswordVery, setNewPasswordVery] = useState("");
  const [logoWebsite, setLogoWebsite] = useState("");
  const [linkLine, setLinkLine] = useState("");
  const [numberQRCode, setNumberQRCode] = useState("");
  const [file, setFile] = useState(null);
  const [bankAgentCode, setBankAgentCode] = useState("");
  const [promotionCode, setPromotionCode] = useState("");
  const [dataSpinWheel, setDataSpinWheel] = useState([]);
  const [outputSpin, setOutputSpin] = useState("");
  const [limitSpinWheel, setLimitSpinWheel] = useState({});
  const [currentPoint, setCurrentPoint] = useState({});
  const [notCurrentPoint, setNotCurrentPoint] = useState(0);
  const [dataOverview, setDataOverview] = useState([]);
  const [dataOverviewYears, setDataOverviewYears] = useState([]);
  const [dataIncome, setDataIncome] = useState([]);
  const [dataHistoryAffiliate, setDataHistoryAffiliate] = useState([]);
  const [codeCupon, setCodeCupon] = useState("");

  const [overviewDate, setOverviewDate] = useState(formatMontYear(new Date()));
  const [incomeDateStart, setIncomeDateStart] = useState(formatMontYear(new Date()));
  const [incomeDateEnd, setIncomeDateEnd] = useState(formatMontYear(new Date()));
  const [years, setYears] = useState([]);
  const [animationRefresh, setAnimationRefresh] = useState(false);
  const [supong, setCupong] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    console.log("UseParams:: ", UseParams);
    if (UseParams?.token) {
      loginByToken();
    } else {
      const _data = DataLoginInRout(history?.location?.state);
      console.log("_data: ", _data?.info);
      if (_data) {
        setLogoWebsite(_data?.info?.configLobby?.s_logo);
        setLinkLine(_data?.info?.configLobby?.s_line);
        setDataFromLogin(_data);
        const slideArray = _data?.info?.slide ? Object.values(_data?.info?.slide) : [];
        const newSlideArray = slideArray.filter((data) => data.s_position === "page_wallet");
        setSliderData(newSlideArray);
        setCurrentPoint(_data?.balance?.cevent);
        setDepositBankList(_data?.info?.bankDeposit[0]);
        const color = BackList.filter((data) => data?.bankName === _data?.info?.bankDeposit[0]?.s_fname_th);
        if (color?.length > 0) {
          setDepositBankList({ ..._data?.info?.bankDeposit[0], background: color[0].backgroundColor });
        }
      }
      setDataPromotion(history?.location?.state?.info?.promotionList);
      // if (_data === undefined) {
      //   history.push(Constant?.HOME);
      // }
      getSpinWheel();
      const currentYear = new Date().getFullYear();
      const yearArray = [];
      for (let year = 2020; year <= currentYear; year++) {
        yearArray.push(year);
      }
      setYears(yearArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UseParams?.token]);

  const loginByToken = () => {
    console.log("AAAA");
    let _res = EncriptBase64(UseParams?.token);
    if (_res?.agentCode && _res?.username && _res?.password) {
      console.log("🚀 ~ loginByToken ~ _res?.password:", _res?.password);
      console.log("🚀 ~ loginByToken ~ _res?.username:", _res?.username);
      console.log("🚀 ~ loginByToken ~ _res?.agentCode:", _res?.agentCode);
      // console.log("RES_BY_HOM: ", _res);
      loginPlayNow(_res?.username, _res?.password);
    }
  };

  useEffect(() => {
    let hasTouchScreen = false;
    if ("maxTouchPoints" in navigator) {
      hasTouchScreen = navigator.maxTouchPoints > 0;
    } else if ("msMaxTouchPoints" in navigator) {
      hasTouchScreen = navigator.msMaxTouchPoints > 0;
    } else {
      const mQ = window.matchMedia && matchMedia("(pointer:coarse)");
      if (mQ && mQ.media === "(pointer:coarse)") {
        hasTouchScreen = !!mQ.matches;
      } else if ("orientation" in window) {
        hasTouchScreen = true; // deprecated, but good fallback
      } else {
        // Only as a last resort, fall back to user agent sniffing
        const UA = navigator.userAgent;
        hasTouchScreen = /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) || /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
      }
    }
    if (hasTouchScreen) {
      setDeviceType("Mobile");
      // console.log("Mobile: ");
    } else {
      setDeviceType("Desktop");
      // console.log("Desktop: ");
    }
    const pageClickEvent = (e) => {
      // If the active element exists and is clicked outside of
      if (sidebarUseRef.current !== "") {
        setSidebarAnimation(false);
        setTimeout(() => {
          setSidebarVisible(false);
        }, 500);
      }
    };

    if (sidebarVisible) {
      window.addEventListener("click", pageClickEvent);
    }

    return () => {
      window.removeEventListener("click", pageClickEvent);
    };
  }, [sidebarVisible]);
  useEffect(() => {
    if (outputSpin) {
      _getData();
      toast.success("ได้รับ" + outputSpin);
    }
  }, [outputSpin]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(current === length - 1 ? 0 : current + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [current]);

  useEffect(() => {
    if (user !== null) {
      _checkToken();
    }
  }, [user]);

  useEffect(() => {
    _clickCategoryGame("SLOT");
    if (dataFromLogin) {
      _getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFromLogin]);

  const _checkToken = async (token) => {
    try {
      const _res = await axios({
        method: "get",
        url: `${Constant.SERVER_URL}/Authen/CheckTokenLogin/eWVEOXhSV2g2N0t1c2thdjRnOUMwYmt6ZHVpdzY3MGR6M2JFNjByVmQ5MD0=`,
      });
      if (_res?.data?.data) {
        const presentTime = new Date();
        const futureTime = new Date(_res?.data?.data?.d_session_expire);
        if (presentTime > futureTime) {
          // history.push("/")
        }
      }
    } catch (error) {}
  };
  const toggleSidebar = (event) => {
    event.stopPropagation();
    setSidebarVisible(true);
    setSidebarAnimation(true);
  };

  const closeSidebar = () => {
    setSidebarAnimation(false);
    setTimeout(() => {
      setSidebarVisible(false);
    }, 500);
  };
  const _clickTabDeposit = (tab) => {
    setTabName(tab);
    if (tab === "tab-deposit") {
      setTabs(t("DepositHistory"));
    } else if (tab === "tab-withdraw") {
      setTabs(t("WithdrawalHistory"));
    } else {
      setTabs(t("BonusHistory"));
    }
  };

  const getQRCode = async (accountNumber) => {
    const _data = await axios.post(`${Constant.SERVER_URL}/genarate-qr-code/${Constant.AGENT_CODE}`, {
      recipientAccountNum: accountNumber,
    });
    setNumberQRCode(_data?.data?.data?.respData?.qrCode);
  };

  const getSpinWheel = async () => {
    let data = JSON.stringify({
      s_agent_code: Constant?.AGENT_CODE,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${Constant.SERVER_URL}/LuckyWheel/Inquiry?XDEBUG_SESSION_START=netbeans-xdebug`,
      headers: {
        "authorization-agent": "{{AUTHEN-VALUE-AGENT}}",
        "authorization-token": "{{AUTHEN-VALUE-TOKEN}}",
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setDataSpinWheel(response.data.data[0]?.eventItem);
        setLimitSpinWheel(response.data.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const _getData = async () => {
    try {
      const _res = await axios({
        method: "post",
        url: `${Constant.SERVER_URL}/Member/Balance`,
        data: {
          s_agent_code: dataFromLogin?.agent,
          s_username: dataFromLogin?.username,
        },
      });
      if (_res?.data?.statusCode === 0) {
        setDataUser(_res?.data?.data);
        setCurrentPoint(_res?.data?.data?.cevent);
        setAnimationRefresh(false);
      }
      const _level = await CheckLevelCashBack(dataFromLogin?.info?.cashback);
      if (_level) setmaxLevel(_level);
      const _resHistoryCashBack = await axios({
        method: "post",
        url: `${Constant.SERVER_URL}/Cashback/History`,
        data: {
          s_agent_code: dataFromLogin?.agent,
          s_username: dataFromLogin?.username,
        },
      });

      if (_resHistoryCashBack?.data?.statusCode === 0) {
        setHistoryCashBack(_resHistoryCashBack?.data?.data);
      }
      const _resHistoryMoney = await axios({
        method: "post",
        url: `${Constant.SERVER_URL}/Member/History/Finance`,
        data: {
          s_agent_code: AGENT_CODE,
          s_username: dataFromLogin?.username,
        },
      });

      if (_resHistoryMoney?.data?.statusCode === 0) {
        setDataHistoryDeposit(_resHistoryMoney?.data?.data?.deposit);
        setDataHistoryBonus(_resHistoryMoney?.data?.data?.bonus);
        setDataHistoryWithdraw(_resHistoryMoney?.data?.data?.withdraw);
      }
    } catch (error) {}
  };

  const _clickCategoryGame = async (value) => {
    setDataGameType(value);
    setDataGameList([]);
    if (value === "FAVORITE") {
      const _getData = await axios({
        method: "post",
        url: `${Constant.SERVER_URL}/Game/Brand/List`,
        data: {
          s_agent_code: dataFromLogin?.agent,
          s_username: dataFromLogin?.username,
        },
      });

      if (_getData?.data?.statusCode === 0) {
        setCategoryGame(_getData?.data?.data?.FAVORITE);
      }
    } else {
      setDataGameList();
      FillerCategory(value, setCategoryGame);
    }
  };

  const _clickFavorite = async (value) => {
    setDataGameType("FAVORITE");
    setDataGameList([]);
    const _getData = await axios({
      method: "post",
      url: `${Constant.SERVER_URL}/Game/Brand/List`,
      data: {
        s_agent_code: dataFromLogin?.agent,
        s_username: dataFromLogin?.username,
      },
    });
    if (_getData?.data?.statusCode === 0) {
      setCategoryGame(_getData?.data?.data?.FAVORITE);
    }
  };

  const _addFavorite = async (value) => {
    const _getData = await axios({
      method: "post",
      url: `${Constant.SERVER_URL}/Favorite/Select`,
      data: {
        s_agent_code: dataFromLogin?.agent,
        s_username: dataFromLogin?.username,
        id_favorite: value?.id_favorite,
        actionBy: "ADM",
      },
    });

    if (_getData?.data?.statusCode === 0) {
      if (dataGameType === "FAVORITE" || dataGameType === "HOTHIT") {
        _clickCategoryGame(dataGameType);
      } else {
        _getDataGame(value);
      }
    }
  };

  const _getDataGame = async (value) => {
    if (value?.s_type === "CASINO" || value?.s_type === "SPORT") {
      _getDataGamePlayGame(value);
      return;
    }

    const _res = await axios({
      method: "post",
      url: `${Constant.SERVER_URL}/Game/ListGame`,
      data: {
        s_agent_code: Constant.AGEN_CODE,
        s_brand_code: value?.s_brand_code,
        s_username: dataFromLogin?.username,
      },
    });
    if (_res?.data?.statusCode === 0) {
      setDataGameList(_res?.data?.data);
      let dataLength = _res?.data?.data?.length;
      generatePercentageData(dataLength);
      const intervalId = setInterval(() => {
        generatePercentageData(dataLength);
      }, 5000);
      return () => clearInterval(intervalId);
    }
  };

  const _getDataGamePlayGame = async (value, type) => {
    try {
      const _data = {
        s_game_code: value?.s_type === "CASINO" ? "B001" : value?.s_type === "SPORT" ? "B001" : value?.s_game_code,
        s_brand_code: value?.s_brand_code,
        s_username: dataFromLogin?.username,
        s_agent_code: Constant?.AGEN_CODE,
        isMobile: deviceType === "Mobile" ? "true" : "false",
        ip_client: "184.22.14.167",
        s_lang: "th",
      };
      // Send the data to the server to get the game URL
      const _res = await axios({
        method: "post",
        url: `${Constant.SERVER_URL}/Game/Access`,
        data: _data,
      });

      if (_res?.data?.url) {
        setTimeout(() => {
          window.open(_res?.data?.url, "_blank");
        });
      }
      if (_res?.data?.res_html) {
        setTimeout(() => {
          OpenNewTabWithHTML(_res?.data?.res_html);
        });
      }
    } catch (error) {
      console.error("Error playing the game:", error);
    }
  };

  const _withdrawMoney = async () => {
    try {
      const _data = {
        s_agent_code: Constant?.AGEN_CODE,
        s_username: dataFromLogin?.username,
        f_amount: dataUser?.amount,
        i_bank: dataFromLogin?.info?.bankList[0]?.id,
        i_ip: "1.2.3.4",
        actionBy: "adm",
      };
      // Send the data to the server to get the game URL
      const _res = await axios({
        method: "post",
        url: `${Constant.SERVER_URL}/Withdraw/CreateTransaction`,
        data: _data,
      });
      if (_res?.data?.statusCode === 0) {
        toast.success(t("TheTransactionWasCompletedSuccessfully"));
        _getData();
      } else {
        toast.error(_res?.data?.statusDesc);
      }
    } catch (error) {}
  };
  //  =================> ChangePassword <=================

  const _ChangePassword = async () => {
    try {
      if (NewPassword !== NewPasswordVery) {
        setReMessage(t("NewPasswordAndConfirmNewPasswordDoNotMatch"));
        return;
      }
      const _data = await ChangePassword(NewPassword, oldPassword);
      if (_data?.data.statusCode === 0) {
        toast.success(_data?.data?.statusDesc);
      } else {
        toast.error(_data?.data?.statusDesc + "!");
      }
    } catch (error) {
      console.error("Error playing the game:", error);
    }
  };

  const _copyLinkAffiliate = (link) => {
    navigator.clipboard.writeText(link);
    toast.success(t("SuccessfullyCopiedLink"));
  };

  const _addCupon = async () => {
    try {
      const _data = await axios.post(`${Constant.SERVER_URL}/Coupon/Receive`, {
        s_agent_code: Constant?.AGEN_CODE,
        s_username: dataFromLogin?.username,
        s_code: codeCupon,
        actionBy: "ADM",
      });
      if (_data?.data?.statusCode === 0) {
        toast.success(_data?.data?.statusDesc);
        handleCloseCupong();
      } else {
        setCupong(true);
        toast.error(_data?.data?.statusDesc);
      }
    } catch (error) {
      console.error("Error playing the game:", error);
    }
  };

  const [nextSliderPage, setNextSliderPage] = useState(0);

  const _newSl = (value) => {
    if (dataPromotion?.length > 0) {
      if (value === "ADD") {
        if (nextSliderPage === dataPromotion?.length - 1) {
          setNextSliderPage(dataPromotion?.length - 1);
        } else {
          setNextSliderPage(nextSliderPage + 1);
        }
      } else {
        if (nextSliderPage === 0) {
          setNextSliderPage(0);
        } else {
          setNextSliderPage(nextSliderPage - 1);
        }
      }
    }
  };

  const apoverPromotion = async (value) => {
    try {
      const _resAppover = await axios.post(`${Constant.SERVER_URL}/Deposit/Promotion/Select`, {
        s_agent_code: Constant?.AGEN_CODE,
        s_username: dataFromLogin?.username,
        s_type: "AUTO",
        s_prm_code: value?.s_code,
        i_ip: "1.2.3.4",
        actionBy: "ADM",
      });
      if (_resAppover?.data?.statusCode === 0) {
        toast.success(t("TheTransactionWasCompletedSuccessfully"));
        setTimeout(() => {
          handleShow();
        }, 2000);
        return;
      }
      toast.error(_resAppover?.data?.statusDesc);
    } catch (error) {
      toast.error(t("UnsuccessfulTransaction"));
    }
  };

  const _receiveCashBack = async () => {
    try {
      const _res = await axios({
        method: "post",
        url: `${Constant.SERVER_URL}/Cashback/Receive`,
        data: {
          s_agent_code: dataFromLogin?.agent,
          s_username: dataFromLogin?.username,
          f_amount: dataFromLogin?.balance?.cashback,
          actionBy: "ADM",
        },
      });
      if (_res?.data?.statusCode === 0) {
        toast.success(_res?.data?.statusDesc);
        _getData();
      } else {
        toast.error(_res?.data?.statusDesc);
      }
    } catch (error) {
      console.log("🚀 ~ const_login= ~ error:", error);
    }
  };

  const _getOptionBank = () => {
    setDisableArrow(!disableArrow);
  };
  const _getOptionBank2 = (bankName) => {
    setDisableArrow(!disableArrow);
    const newData = JSON.parse(bankName);
    const color = BackList.filter((data) => data?.bankName === newData?.s_fname_th);
    if (color?.length > 0) {
      setDepositBankList({ ...newData, background: color[0].backgroundColor });
    }
  };
  const _getOptionBankQR = (bankName) => {
    getQRCode(bankName);
  };
  const _copyAccountNo = (accountNo) => {
    navigator.clipboard.writeText(accountNo);
    toast.success(t("SuccessfullyCopiedLink"));
  };

  const length = sliderData.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(sliderData) || sliderData.length <= 0) {
    return null;
  }

  const generatePercentageData = (count) => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const percentage = Math.random();
      data.push({ percentage: percentage });
    }
    setPercentageData(data);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return;

    const _URL = window.URL || window.webkitURL;
    const url = _URL.createObjectURL(file);
    const imgData = await uploadSlip(url);
    document.getElementById("fileslip").value = "";
    if (imgData != null) {
      try {
        const response = await axios.post(`${Constant.SERVER_URL}/Deposit/Slip`, {
          actionBy: dataFromLogin?.username,
          s_agent_code: dataFromLogin?.agent,
          s_username: dataFromLogin?.username,
          qrcode: imgData.data,
          i_bank_agent: bankAgentCode,
          i_ip: "1.2.3.4",
          s_prm_code: promotionCode,
        });
        toast.error(response?.data?.statusDesc);
      } catch (error) {}
    } else {
    }
  };

  const uploadSlip = async (url) => {
    let imgData = null;
    const minScale = 0.75;
    const maxScale = 5;
    const step = 0.25;
    let currentScale = minScale;
    do {
      imgData = await addImageProcess(url, currentScale);
      currentScale += step;
    } while (imgData === null && currentScale <= maxScale);

    return imgData;
  };

  const addImageProcess = (src, scale) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(img.width * scale);
        canvas.height = Math.floor(img.height * scale);

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const pixels = imgData.data;
        for (let i = 0; i < pixels.length; i += 4) {
          const lightness = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
          pixels[i] = lightness;
          pixels[i + 1] = lightness;
          pixels[i + 2] = lightness;
        }
        ctx.putImageData(imgData, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        resolve(code);
      };
      img.onerror = reject;
      img.src = src;
    });
  };

  const _getBankAgentCode = (event) => {
    let data = JSON.stringify({
      data: event,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${Constant.SERVER_URL}/Decrypt`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setBankAgentCode(response.data.decrypt);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const _tabAffiliate = (tabAffiliate) => {
    setTabNameAffiliate(tabAffiliate);
    if (tabAffiliate === "overview") {
      _getRegister();
    } else if (tabAffiliate === "income") {
      _getIncome(incomeDateStart, incomeDateEnd);
    } else {
      _getHistory();
    }
  };

  const _getRegister = async () => {
    const _res = await axios({
      method: "post",
      url: `${Constant.SERVER_URL}/Affiliate/Inquiry/Register`,
      data: {
        s_agent_code: Constant?.AGENT_CODE,
        s_username: dataFromLogin?.username,
        d_date: overviewDate,
        page_start: 0,
      },
    });
    if (_res?.data?.statusCode === 0) {
      setDataOverview(_res?.data?.data?.list);
    }
  };

  const _selectYear = (event) => {
    _getRegisterByYear(event);
  };

  const _getRegisterByYear = async (year) => {
    const _res = await axios({
      method: "post",
      url: `${Constant.SERVER_URL}/Affiliate/Inquiry/RegisterByYear`,
      data: {
        s_agent_code: Constant?.AGENT_CODE,
        s_username: dataFromLogin?.username,
        d_date: year,
        page_start: 0,
      },
    });
    if (_res?.data?.statusCode === 0) {
      setDataOverviewYears(_res?.data?.data);
    }
  };

  const _getIncome = async (dateStart, dateEnd) => {
    const _res = await axios({
      method: "post",
      url: `${Constant.SERVER_URL}/Affiliate/Inquiry/Income`,
      data: {
        s_agent_code: Constant?.AGENT_CODE,
        s_username: dataFromLogin?.username,
        d_start: dateStart,
        d_end: dateEnd,
        page_start: 0,
      },
    });
    if (_res?.data?.statusCode === 0) {
      setDataIncome(_res?.data?.data?.list);
    }
  };

  const _getIncomeDateStart = (event) => {
    setIncomeDateStart(event?.target?.value);
    _getIncome(event?.target?.value, incomeDateEnd);
  };

  const _getIncomeDateEnd = (event) => {
    setIncomeDateEnd(event?.target?.value);
    _getIncome(incomeDateStart, event?.target?.value);
  };

  const _getHistory = async () => {
    const _res = await axios({
      method: "post",
      url: `${Constant.SERVER_URL}/Affiliate/History`,
      data: {
        s_agent_code: Constant?.AGENT_CODE,
        s_username: dataFromLogin?.username,
      },
    });
    if (_res?.data?.statusCode === 0) {
      setDataHistoryAffiliate(_res?.data?.data);
    }
  };

  const _getReceiveAffiliate = async (amount) => {
    const _res = await axios({
      method: "post",
      url: `${Constant.SERVER_URL}/Affiliate/Receive`,
      data: {
        s_agent_code: Constant?.AGENT_CODE,
        s_username: dataFromLogin?.username,
        f_amount: amount,
        actionBy: "ADM",
      },
    });
    if (_res?.data?.statusCode === 0) {
      setDataHistoryAffiliate(_res?.data?.data);
      toast.success(_res?.data?.statusDesc);
    } else {
      toast.error(_res?.data?.statusDesc);
    }
  };

  const refreshBalance = (e) => {
    e.stopPropagation();
    setAnimationRefresh(true);
    _getData();
  };

 

  return (
    <div>
      <header className="login-page-header">
        <img
          src="/assets/images/icon-hamburger.svg"
          alt="hamburger"
          className="hamburger"
          height="37px"
          width="35px"
          onClick={(event) => toggleSidebar(event)}
          onKeyDown={() => ""}
        />
        <div className="left">
          <div className="coin-balance">
            <img src="/assets/images/gif/border-card-bank.gif" alt="coin" />
            {dataUser?.amount}
          </div>
          <img
            src="/assets/images/icons8-refresh-30.png"
            onClick={(e) => refreshBalance(e)}
            alt="fresh"
            className={animationRefresh === true ? "refresh-balance" : ""}
            style={{ width: 20, height: 20, cursor: "pointer", marginLeft: 10 }}
          />
        </div>
        <div className="middle">
          <img src={`data:image/jpeg;base64,${logoWebsite}`} alt="logo" style={{ cursor: "pointer", height: 45 }} id="banner" />
        </div>
        <div className="right">
          <div className="gem-balance">
            <img src="/assets/images/gem.svg" alt="gem" />
            {dataUser?.point}
          </div>
        </div>
        <div style={{ position: "fixed", right: 20, zIndex: 300 }}>
          <Translate />
        </div>
      </header>

      <main className="home">
        <div className="brand">
          <div className="slideshow-container">
            <div className="mySlides fade-slide">
              <div className="left-arrow" onClick={() => prevSlide()} onKeyDown={() => ""}>
                ❮
              </div>
              <div className="right-arrow" onClick={() => nextSlide()} onKeyDown={() => ""}>
                ❯
              </div>
              {sliderData?.length > 0 &&
                sliderData?.map((slide, index) => {
                  return (
                    <div className={index === current ? "slide1 active" : "slide1"} key={index}>
                      {index === current && (
                        <img
                          src={slide?.s_image ? `data:image/jpeg;base64,${slide?.s_image}` : "/assets/images/Cardgame/image 70.png"}
                          alt="travel"
                          style={{ width: "100%" }}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <section className="featured-game-wrapper">
          <div className="container flexBetween">
            <div className="featured-game flexBetween" onClick={() => _clickFavorite()} onKeyDown={() => ""}>
              <img src="/assets/images/newicon/favorite.png" alt="game icon" />
              <p>{t("FavoriteGame")}</p>
            </div>
            <div className="featured-game flexBetween" onClick={() => _clickCategoryGame("HOTHIT")} onKeyDown={() => ""}>
              <img src="/assets/images/newicon/hothit.png" alt="game icon" />
              <p style={{ fontSize: 20 }}>{t("popular")}</p>
            </div>
            <div className="featured-game flexBetween" onClick={() => _clickCategoryGame("SLOT")} onKeyDown={() => ""}>
              <img src="/assets/images/newicon/iconnew-01.png" alt="game icon" />
              <p>{t("slots")}</p>
            </div>
            <div className="featured-game flexBetween" onClick={() => _clickCategoryGame("CASINO")} onKeyDown={() => ""}>
              <img src="/assets/images/newicon/iconnew-02.png" alt="game icon" />
              <p>{t("casino")}</p>
            </div>
            <div className="featured-game flexBetween" onClick={() => _clickCategoryGame("FISHING")} onKeyDown={() => ""}>
              <img src="/assets/images/newicon/iconnew-03.png" alt="game icon" />
              <p>{t("ShootFish")}</p>
            </div>
            <div className="featured-game flexBetween" onClick={() => _clickCategoryGame("SPORT")} onKeyDown={() => ""}>
              <img src="/assets/images/newicon/iconnew-05.png" alt="game icon" />
              <p>{t("sport")}</p>
            </div>
          </div>
        </section>

        <section className="card-container">
          <div className="card-wrapper">
            {dataGameList?.length
              ? dataGameList?.map((game, index) => (
                  <div key={game?.index} className="game-card">
                    <div
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        zIndex: 1,
                        backgroundColor: game?.s_flg_favorite === "Y" ? "#FE2147" : "#A4A4A4",
                        padding: 8,
                        borderRadius: "50%",
                        alignItems: "center",
                        justifyContent: "center",
                        display: "flex",
                      }}
                      onClick={() => _addFavorite(game)}
                      onKeyDown={() => ""}
                    >
                      <FontAwesomeIcon icon={faHeart} style={{ color: "white", fontSize: 25 }} />
                    </div>
                    <div className="percentage">RTP {(percentageData[index]?.percentage * 100).toFixed(2)} %</div>
                    <img
                      src={game?.s_img ?? "/assets/images/jilli_card.svg"}
                      id="game-card"
                      className="game-image"
                      alt="game"
                      onClick={() => _getDataGamePlayGame(game)}
                      onKeyDown={() => ""}
                    />
                  </div>
                ))
              : categoryGame?.length > 0 &&
                categoryGame?.map((item, index) => (
                  <div key={item?.index} className="game-card">
                    {dataGameType === "FAVORITE" || dataGameType === "HOTHIT" ? (
                      <div
                        style={{
                          position: "absolute",
                          top: "0",
                          left: "0",
                          zIndex: 1,
                          backgroundColor: "#FE2147", //"#A4A4A4"
                          padding: 8,
                          borderRadius: "50%",
                          alignItems: "center",
                          justifyContent: "center",
                          display: "flex",
                        }}
                        onClick={() => _addFavorite(item)}
                        onKeyDown={() => ""}
                      >
                        <FontAwesomeIcon icon={faHeart} style={{ color: "#FFF", fontSize: 25 }} />
                      </div>
                    ) : null}
                    {item?.s_img !== undefined ? (
                      <img
                        src={item?.s_img}
                        style={{ width: 148, height: 183 }}
                        id="game-card"
                        className="game-image"
                        alt="game"
                        onKeyDown={() => ""}
                        onClick={() =>
                          dataGameType === "FAVORITE" || dataGameType === "HOTHIT" || dataGameType === "FISHING"
                            ? _getDataGamePlayGame(item, "FISHING")
                            : _getDataGame(item)
                        }
                      />
                    ) : (
                      <img
                        src={item?.s_lobby_url}
                        id="game-card"
                        className="url"
                        alt="game"
                        onKeyDown={() => ""}
                        onClick={() => (dataGameType === "FAVORITE" || dataGameType === "HOTHIT" ? _getDataGamePlayGame(item) : _getDataGame(item))}
                      />
                    )}
                  </div>
                ))}
          </div>
        </section>
        <div className="partnership-container" />
        {sidebarVisible ? (
          <div className="sidebar-container" ref={sidebarUseRef}>
            <aside
              className="sidebar"
              style={{
                animation: `${sidebarAnimation ? "slideInFromLeft" : "slideInToLeft"} 0.5s ease-in-out`,
              }}
            >
              <div className="icon-turn-back" onClick={() => closeSidebar()} onKeyDown={() => ""}>
                <img src="/assets/images/turn-back 1.png" alt="logo" />
              </div>
              <img src={`data:image/jpeg;base64,${logoWebsite}`} alt="logo" />
              <div className="flexBetween font-14">
                <p>Username:</p>
                <p>{dataFromLogin?.username}</p>
              </div>
              {/* <div className="flexBetween font-14">
                                <p>Phone :</p>
                                <p>{dataFromLogin?.info?.s_phone}</p>
                            </div> */}
              <div className="balance">
                <small>
                  {t("remainingBalance")}
                  <span style={{ marginLeft: 8 }}>
                    <img
                      src="/assets/images/icons8-refresh-30.png"
                      onClick={(e) => refreshBalance(e)}
                      alt="fresh"
                      className={animationRefresh === true ? "refresh-balance" : ""}
                      style={{ width: 20, height: 20, cursor: "pointer" }}
                    />
                  </span>
                </small>
                <p>{dataUser?.amount}</p>
              </div>

              <div className="flexBetween" style={{ gap: 13 }}>
                <button
                  type="button"
                  className="gradient-border sidebar-button flexCenter"
                  style={{ width: "50%" }}
                  data-bs-toggle="modal"
                  data-bs-target="#profile"
                >
                  {t("AccountInformation")}
                </button>
                <button
                  type="button"
                  className="gradient-border sidebar-button flexCenter"
                  data-bs-toggle="modal"
                  data-bs-target="#depositWithdraw"
                  style={{ width: "50%" }}
                >
                  {t("DepositWithdraw")}
                </button>
              </div>
              <div className="flexBetween" style={{ gap: 13 }}>
                <button
                  type="button"
                  className="gradient-border sidebar-button flexCenter"
                  style={{ width: "50%" }}
                  id="bag-modal-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#bagModal"
                >
                  {t("bag")}
                </button>
                <button
                  type="button"
                  className="gradient-border sidebar-button flexCenter"
                  style={{ width: "50%" }}
                  id="history-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#historyModal"
                >
                  {t("Record")}
                </button>
              </div>
              <div className="flexBetween" style={{ gap: 13 }}>
                <button type="button" className="gradient-border sidebar-button flexCenter" style={{ width: "50%" }}>
                  {t("LineBotNotification")}
                </button>
                {/*
                                <button
                                    type='button'
                                    className="gradient-border sidebar-button flexCenter"
                                    style={{ fontSize: 17, width: "100%" }}
                                > */}
                <a
                  target="_blank"
                  className="gradient-border sidebar-button flexCenter"
                  style={{ fontSize: 17, width: "50%", textDecoration: "none" }}
                  href={linkLine}
                  rel="noreferrer"
                >
                  {t("ContactUs")}
                </a>

                {/* </button> */}
              </div>
              <button
                type="button"
                className="gradient-border sidebar-button flexCenter"
                style={{ width: "100%", marginBottom: 16 }}
                data-bs-toggle="modal"
                data-bs-target="#changePasswordModal"
              >
                {t("ChangePassword")}
              </button>
              <button
                type="button"
                className="gradient-border sidebar-button flexCenter"
                data-bs-toggle="modal"
                data-bs-target="#confirmLogout"
                style={{ width: "100%", marginBottom: 16 }}
              >
                {t("Logout")}
              </button>

              {/* <div className="download-container">
                                <h3>ดาวน์โหลดแอปเลย !</h3>
                                <div className="flexBetween" style={{ gap: 6 }}>
                                    <img
                                        src="/assets/images/get-it-playstore.svg"
                                        alt="download icon"
                                        style={{ height: 32, cursor: "pointer" }}
                                    />
                                    <img
                                        src="/assets/images/get-it-appstore.svg"
                                        alt="download icon"
                                        style={{ height: 32, cursor: "pointer" }}
                                    />
                                </div>
                            </div> */}

              {/* <h4>Power by</h4>
                            <img src={`data:image/jpeg;base64,${logoWebsite}`} alt="powerby" /> */}
            </aside>
            <div className="sidebar-container-background" />
          </div>
        ) : null}

        {/* <!-- start profile --> */}
        <div className="modal fade" id="profile" tabindex="-1" aria-labelledby="profile" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-border">
              <div className="modal-content">
                <div className="modal-header-container">
                  <div className="modal-header">
                    {/* <img
                                            src="/assets/icons/icon-back-modal.svg"
                                            className="modal-icon-back"
                                            alt=""
                                            data-bs-dismiss="modal"
                                        /> */}
                    <p className="modal-title">{t("AccountInformation")}</p>
                    <img src="/assets/icons/icon-close-modal.svg" className="modal-icon-close" data-bs-dismiss="modal" aria-label="Close" alt="" />
                  </div>
                </div>
                <div className="modal-body">
                  <div className="change-profile-modal-content">
                    {dataFromLogin?.info?.bankList?.length > 0 &&
                      dataFromLogin?.info?.bankList?.map((item, index) => (
                        <div key={index}>
                          <div className="user">
                            <p className="username">Bank</p>
                            <div style={{ textTransform: "uppercase" }}>
                              {item?.s_icon.split(".")[0]}
                              <img
                                style={{ marginLeft: 10, width: 50, height: 50 }}
                                src={`/assets/images/bank/${item?.s_icon}`}
                                alt="logo bank"
                                className="result"
                              />
                            </div>
                          </div>
                          <br />
                          <div className="user">
                            <p className="username">Account Number</p>
                            <p className="result">{item?.s_account_no}</p>
                          </div>
                          <br />
                          <div className="user">
                            <p className="username">Account Name</p>
                            <p className="result">{item?.s_account_name}</p>
                          </div>
                          <div style={{ border: "1px solid #b78113" }} />
                        </div>
                      ))}

                    {/* <div style={{ border: "1px solid #b78113" }} /> */}
                    {/* <div className="user">
                                            <p className="username">ชื่อ</p>
                                            <p className="result">{dataFromLogin?.info?.profile?.s_firstname}</p>
                                        </div> */}
                    <div className="user">
                      <p className="username">Line ID</p>
                      <p className="result">{dataFromLogin?.info?.profile?.s_line}</p>
                    </div>
                    <div className="user">
                      <p className="username">Username</p>
                      <p className="result">{dataFromLogin?.info?.profile?.s_username}</p>
                    </div>
                    <div className="password">
                      <p className="pass">Password</p>
                      <p className="result">************</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- end profile --> */}

        {/* <!-- start cashback detail --> */}
        <div className="modal fade" id="cashbackDetail" tabindex="-1" aria-labelledby="cashbackDetail" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-border">
              <div className="modal-content">
                <div className="modal-header-container">
                  <div className="modal-header">
                    <img
                      src="/assets/icons/icon-back-modal.svg"
                      className="modal-icon-back"
                      alt=""
                      data-bs-toggle="modal"
                      data-bs-target="#bagModal"
                      data-bs-dismiss="modal"
                    />
                    <p className="modal-title">{t("ReturnTheLostAmount")}</p>
                    <img src="/assets/icons/icon-close-modal.svg" className="modal-icon-close" data-bs-dismiss="modal" aria-label="Close" alt="" />
                  </div>
                </div>
                <div className="modal-body">
                  <div className="change-cashback-detail-modal-content">
                    <div className="detail" style={{ display: "flex", flexDirection: "column" }}>
                      <div className="your-loss">
                        {t("YourAccumulatedLosses")} ({t("ReturnTheLostAmount")} {maxLevel} %)
                      </div>
                      <button
                        aria-label="Close"
                        type="button"
                        className="withdraw-to-accont"
                        style={{ backgroundColor: "green", color: "white", padding: 10, borderRadius: 8 }}
                        data-bs-toggle="modal"
                        data-bs-target="#historyCashback"
                        data-bs-dismiss="modal"
                      >
                        {t("ReceiptHistory")}
                      </button>
                      <div className="loss">{dataUser?.cashback}</div>
                      <div style={{ textAlign: "center", fontSize: 14 }}>
                        {t("LatestUpdate")} {historyCashBack?.length > 0 && historyCashBack[historyCashBack?.length - 1]?.d_create}
                      </div>
                      <div className="btn">
                        <button type="button" className="receive-credit" onClick={() => _receiveCashBack()}>
                          {t("receiveCredit")}
                        </button>
                      </div>
                      <div style={{ textAlign: "center", color: "red" }}>{reMessage}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- end cashback detail --> */}

        {/* <!-- start  modal ฝาก - ถอน --> */}
        <div className="modal fade" id="depositWithdraw" tabindex="-1" aria-labelledby="depositWithdraw" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-border">
              <div className="modal-content">
                <div className="modal-header-container">
                  <div className="modal-header">
                    <img src="/assets/icons/icon-back-modal.svg" className="modal-icon-back" alt="" data-bs-dismiss="modal" aria-label="Close" />
                    <p className="modal-title" id="depositWithdraw">
                      {t("DepositWithdraw")}
                    </p>
                    <img src="/assets/icons/icon-close-modal.svg" className="modal-icon-close" data-bs-dismiss="modal" aria-label="Close" alt="" />
                  </div>
                </div>
                <div className="modal-body">
                  {/* <div className="detail-card-kbank">
                                        <div className="card-kbank">
                                            <div className="font-17" style={{ marginTop: 20 }}>
                                                <p>ธนาคารกสิกรไทย</p>
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    KBank
                                                    <img
                                                        src="/assets/icons/logo-kbank.svg"
                                                        alt="logo"
                                                        style={{ marginTop: -15 }}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-17">นาย xxxxx xxxxx</p>
                                                <p style={{ marginTop: 13, fontSize: 14 }}>
                                                    ยอดคงเหลือในระบบ
                                                </p>
                                            </div>
                                            <div className="font-17">
                                                <p style={{ marginTop: -2 }}>026-999999-9</p>
                                                <p>1000.00 บาท</p>
                                            </div>
                                            <div
                                                style={{
                                                    marginBottom: 30,
                                                    display:
                                                        "flex",
                                                    justifyContent:
                                                        "end",
                                                }}
                                            >
                                                <img src="/assets/icons/visa.svg" alt="visa" />
                                            </div>
                                        </div>
                                    </div> */}
                  <div className="slide-image">
                    <div className="active" />
                    <div className="none-active" />
                  </div>

                  <div
                    style={{
                      marginTop: 20,
                      display: "grid",
                      color: "white",
                      gridTemplateColumns: "repeat(3, 110px)",
                      gap: 16,
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ cursor: "pointer" }} data-bs-toggle="modal" data-bs-target="#autoDeposit" data-bs-dismiss="modal">
                      <div className="type-of-withdrawal">
                        <div className="withdrawal">
                          <img src="/assets/images/credit-card-machine.svg" alt="kkk" />
                          <div>{t("AutoDeposit")}</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ cursor: "pointer" }} data-bs-toggle="modal" data-bs-target="#leaveAdecimal" data-bs-dismiss="modal">
                      <div className="type-of-withdrawal">
                        <div className="withdrawal">
                          <img style={{ width: 56 }} src="/assets/images/qrpay.png" alt="kkk" />
                          <div>{t("QRCode")}</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ cursor: "pointer" }} data-bs-toggle="modal" data-bs-target="#withdraw" data-bs-dismiss="modal">
                      <div className="type-of-withdrawal">
                        <div className="withdrawal">
                          <img src="/assets/images/Withdraw-money.svg" alt="kkk" />
                          <div>{t("WithdrawMoney")}</div>
                        </div>
                      </div>
                    </div>

                    {/* <div
                                            style={{ cursor: 'pointer' }}
                                            data-bs-toggle="modal"
                                            data-bs-target="#qrplay"
                                            data-bs-dismiss="modal"
                                        >
                                            <div className="type-of-withdrawal">
                                                <div className="withdrawal">
                                                    <img src="/assets/images/scan.svg" alt="kkk" />
                                                    <div>QR PAY</div>
                                                </div>
                                            </div>
                                        </div> */}

                    {/* <div
                                            style={{ cursor: 'pointer' }}
                                            data-bs-toggle="modal"
                                            data-bs-target="#slipVerify"
                                            data-bs-dismiss="modal"
                                        >
                                            <div className="type-of-withdrawal">
                                                <div className="withdrawal">
                                                    <img src="/assets/images/verified.svg" alt="kkk" />
                                                    <div>Slip Verify</div>
                                                </div>
                                            </div>
                                        </div> */}
                  </div>

                  <div style={{ textAlign: "center", marginTop: 10, fontSize: 12 }}>
                    <div>
                      {t("FoundProblem")}
                      <span
                        style={{
                          color: "red",
                          textDecoration: "underline",
                          marginLeft: 5,
                          // cursor: 'pointer',
                        }}
                      >
                        {t("ContactCustomerService")}
                      </span>
                    </div>
                  </div>
                  {/* <div className="button-line">
                                        <div>
                                            <img
                                                src="/assets/icons/icon-line.svg"
                                                alt="line"
                                                style={{ width: 30, height: 30 }}
                                            />
                                            ไลน์บอทkk / แจ้งเตือนยอดฝาก - ถอน
                                        </div>
                                    </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- end  modal ฝาก - ถอน --> */}

        {/* <!-- start  modal ฝากออโต้ --> */}
        <div className="modal fade" id="autoDeposit" tabindex="-1" aria-labelledby="autoDeposit" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-border">
              <div className="modal-content">
                <div className="modal-header-container">
                  <div className="modal-header">
                    <img
                      src="/assets/icons/icon-back-modal.svg"
                      className="modal-icon-back"
                      alt=""
                      data-bs-toggle="modal"
                      data-bs-target="#depositWithdraw"
                    />
                    <p className="modal-title" id="autoDeposit">
                      {t("AutoDeposit")}
                    </p>
                    <img src="/assets/icons/icon-close-modal.svg" className="modal-icon-close" data-bs-dismiss="modal" aria-label="Close" alt="" />
                  </div>
                </div>
                <div className="modal-body">
                  <div className="detail-card-scb1">
                    <div className="card-scb1" style={{ background: depositBankList && depositBankList?.background }}>
                      <div className="left">
                        <p>{depositBankList && depositBankList?.s_fname_th}</p>
                        <p>{depositBankList && depositBankList?.s_account_name}</p>
                        <p>
                          {depositBankList && depositBankList?.s_account_no}
                          <span>
                            <img
                              src="/assets/images/icon-coppy.svg"
                              onClick={() => _copyAccountNo(depositBankList?.s_account_no)}
                              alt=""
                              style={{ width: 30, height: 30, marginBottom: -3 }}
                            />
                          </span>
                        </p>
                      </div>
                      <div className="right">
                        <div className="bank">
                          <h3 style={{ textTransform: "uppercase" }}>{depositBankList && depositBankList?.s_icon.split(".")[0]}</h3>
                          <div style={{ borderRadius: "100%", marginTop: -10 }}>
                            <img src={`/assets/images/bank/${depositBankList && depositBankList?.s_icon}`} alt="scb" />
                          </div>
                        </div>
                        <div style={{ marginLeft: 50 }}>
                          <div className="deposit-bank-title-pc">{t("ChangeBank")}</div>
                          <img
                            onClick={() => _getOptionBank()}
                            onKeyDown={() => ""}
                            style={{ width: 30, height: 30, display: disableArrow === true ? "none" : "block", cursor: "pointer" }}
                            src="/assets/images/arrow-bottom.svg"
                            alt=""
                            srcset=""
                          />
                          <select
                            onChange={(e) => _getOptionBank2(e.target.value)}
                            className="deposit-bank-list-pc"
                            style={{ display: disableArrow === true ? "block" : "none" }}
                          >
                            {dataFromLogin?.info?.bankDeposit?.length > 0 &&
                              dataFromLogin?.info?.bankDeposit?.map((bank) => (
                                <option key={bank?.index} value={JSON.stringify(bank)}>
                                  {bank?.s_fname_th}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div data-bs-toggle="modal" data-bs-target="#slipVerify">
                    <div className="btn-slip">
                      <div style={{ color: "white" }}>
                        <img style={{ width: 20, height: 20 }} src="/assets/images/icons8-exclamation-50.png" alt="exclamation" />{" "}
                        {t("ReportMoneyNotReceivedSlipForm")}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "center", marginTop: 10, fontSize: 14 }}>
                    <div>
                      {t("FoundProblem")}
                      <span>{t("ContactCustomerService")}</span>
                    </div>
                  </div>
                  {/* <div className="button-line">
                                        <div>
                                            <img
                                                src="/assets/icons/icon-line.svg"
                                                style={{ width: 28, height: 28 }}
                                                alt="line"
                                            />
                                            ไลน์บอท / แจ้งเตือนยอดฝาก - ถอน
                                        </div>
                                    </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- end  modal ฝาก - ถอน --> */}

        {/* <!-- start  modal ฝากทศนิยม --> */}
        <div className="modal fade" id="leaveAdecimal" tabindex="-1" aria-labelledby="leaveAdecimal" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-border">
              <div className="modal-content">
                <div className="modal-header-container">
                  <div className="modal-header">
                    <img
                      src="/assets/icons/icon-back-modal.svg"
                      className="modal-icon-back"
                      alt=""
                      data-bs-toggle="modal"
                      data-bs-target="#depositWithdraw"
                      data-bs-dismiss="modal"
                    />
                    <p className="modal-title">{t("DepositMoneyWithQRCode")}</p>
                    <img src="/assets/icons/icon-close-modal.svg" className="modal-icon-close" data-bs-dismiss="modal" aria-label="Close" alt="" />
                  </div>
                </div>
                <div className="modal-body">
                  <div style={{ marginTop: 30 }}>
                    <select onChange={(e) => _getOptionBankQR(e.target.value)}>
                      {dataFromLogin?.info?.bankDeposit?.length > 0 &&
                        dataFromLogin?.info?.bankDeposit?.map((bank) => (
                          <option key={bank?.index} value={bank?.s_account_no}>
                            {bank?.s_fname_th}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div style={{ marginTop: 20, background: "#FFFF", padding: 12, borderRadius: 8 }}>
                    <QRCode style={{ width: 250, height: 250 }} value={numberQRCode} />
                  </div>
                  <div style={{ width: 300, marginTop: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>{t("BankName")}: </div>
                      <div>{depositBankList && depositBankList?.s_fname_th}</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>{t("AccountMumber")}:</div>
                      <div>{depositBankList && depositBankList?.s_account_no}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- end  modal ฝากทศนิยม --> */}
      </main>
      {/* <!-- end  modal ฝากทศนิยม --> */}

      {/* <!-- ถอนเงิน start  modal --> */}

      <div className="modal fade" id="withdraw" tabindex="-1" aria-labelledby="withdraw" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-border">
            <div className="modal-content">
              <div className="modal-header-container">
                <div className="modal-header">
                  <img
                    src="/assets/icons/icon-back-modal.svg"
                    className="modal-icon-back"
                    alt=""
                    data-bs-toggle="modal"
                    data-bs-target="#depositWithdraw"
                    data-bs-dismiss="modal"
                  />
                  <p className="modal-title" id="withdraw">
                    {t("WithdrawMoney")}
                  </p>
                  <img src="/assets/icons/icon-close-modal.svg" className="modal-icon-close" data-bs-dismiss="modal" aria-label="Close" alt="" />
                </div>
              </div>
              <div className="modal-body">
                <div className="withdraw-modal-content flexCenter">
                  {dataFromLogin?.length > 0 &&
                    dataFromLogin?.info?.bankList?.map((item, index) => (
                      <div key={index} className="card flexBetween">
                        <div className="left flexCenter">
                          <p>{item?.s_account_name}</p>
                          <p>{item?.s_account_no}</p>
                        </div>
                        <div className="right flexCenter">
                          <div className="flexCenter bank">
                            <div>{item?.s_icon.split(".")[0]}</div>
                            <div style={{ backgroundColor: "#fff", borderRadius: "100%" }}>
                              <img src={`/assets/images/bank/${item?.s_icon}`} alt="kbank" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  <div className="money-input flexBetween" style={{ marginTop: 50 }}>
                    <p>{t("AmountThatCanBeWithdrawn")}</p>
                    <input type="text" value={dataUser?.amount} disabled={true} />
                  </div>

                  <div className="button-warning" onClick={() => _withdrawMoney()} onKeyDown={() => ""}>
                    {t("WithdrawMoney")}
                  </div>
                  <p style={{ display: "flex" }}>
                    {t("FoundProblem")}
                    <div style={{ marginLeft: "5px", color: "red" }}>{t("ContactCustomerService")}</div>
                  </p>

                  {/* <button type='button' className="line-button flexCenter">
                                        <img src="/assets/icons/icon-line.svg" alt="line icon" />
                                        <p>ไลน์บอท / แจ้งเตือนยอดฝาก - ถอน</p>
                                    </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- ถอนเงิน end modal --> */}

      {/* <!-- start  modal QR Pay --> */}
      <div className="modal fade" id="qrplay" tabindex="-1" aria-labelledby="qrplay" aria-hidden="true" data-bs-dismiss="modal">
        <div className="modal-dialog">
          <div className="modal-border">
            <div className="modal-content">
              <div className="modal-header-container">
                <div className="modal-header">
                  <img
                    src="/assets/icons/icon-back-modal.svg"
                    className="modal-icon-back"
                    alt=""
                    data-bs-toggle="modal"
                    data-bs-target="#depositWithdraw"
                    data-bs-dismiss="modal"
                  />
                  <p className="modal-title" id="qrplay">
                    QR PAY
                  </p>
                  <img src="/assets/icons/icon-close-modal.svg" className="modal-icon-close" data-bs-dismiss="modal" aria-label="Close" alt="" />
                </div>
              </div>
              <div className="modal-body">
                <div className="qr-pay-content-1">
                  <div className="notic-text">
                    <ul>
                      <li>ฝากขั้นต่ำ 100 บาท สูงสุด 50,000.00 บาท *</li>
                    </ul>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      marginBottom: -10,
                      marginLeft: 5,
                      color: "red",
                    }}
                  >
                    {t("ChooseABank")}
                  </div>
                  <div className="bank-selector">
                    <select className="vodiapicker">
                      <option
                        value="kbank"
                        className="test"
                        data-thumbnail="https://www.kasikornbank.com/SiteCollectionDocuments/about/img/logo/logo.png"
                      />
                      <option value="au" data-thumbnail="https://www.uhub.co.th/assets/images/icons/mobile/scb-icon.png" />
                    </select>

                    <div className="lang-select">
                      <button type="button" className="btn-select" value="">
                        .
                      </button>
                      <img src="/assets/icons/icon-drow.svg" alt="" style={{ margin: "5px 0 0 -27px" }} />
                      <div className="b">
                        <ul id="a" />
                      </div>
                    </div>

                    <div className="show-username-bank">นาย ปปปปป ปปปปป</div>
                  </div>

                  <div className="confirmation" style={{ marginLeft: 30, marginRight: 30 }}>
                    <input type="text" className="text-amount-money" placeholder="กรอกจำนวนเงินที่ต้องการฝาก" />
                    <div
                      className="confirm-the-amount"
                      style={{ cursor: "pointer" }}
                      data-bs-toggle="modal"
                      data-bs-target="#showQR"
                      data-bs-dismiss="modal"
                    >
                      <div>{t("confrmAmt")}</div>
                    </div>
                  </div>

                  <div className="info-text" style={{ fontSize: 13 }}>
                    <p>
                      {t("FoundProblem")}
                      <a
                        href="#/"
                        style={{
                          color: "red",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        {t("ContactCustomerService")}
                      </a>
                    </p>
                  </div>
                  {/* <div className="button-line">
                                        <div>
                                            <img
                                                src="/assets/icons/icon-line.svg"
                                                style={{ width: 30, height: 30 }}
                                                alt="line"
                                            />
                                            ไลน์บอท / แจ้งเตือนยอดฝาก - ถอน
                                        </div>
                                    </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- end  modal QR Pay --> */}

      {/* <!-- start modal QR  --> */}
      <div className="modal fade" id="showQR" tabindex="-1" aria-labelledby="showQR" aria-hidden="true" data-bs-dismiss="modal">
        <div className="modal-dialog">
          <div className="modal-border">
            <div className="modal-content">
              <div className="modal-header-container">
                <div className="modal-header">
                  <img
                    src="/assets/icons/icon-back-modal.svg"
                    className="modal-icon-back"
                    alt=""
                    data-bs-toggle="modal"
                    data-bs-target="#qrplay"
                    data-bs-dismiss="modal"
                  />
                  <p className="modal-title" id="showQR">
                    QR PAY
                  </p>
                  <img src="/assets/icons/icon-close-modal.svg" className="modal-icon-close" data-bs-dismiss="modal" aria-label="Close" alt="" />
                </div>
              </div>
              <div className="modal-body">
                <div style={{ marginTop: 20 }}>
                  <div className="detail-qr">
                    <div className="div1">จำนวนเงินฝากผ่าน QR Code</div>
                    <div className="div2">111.11 บาท</div>
                    <div className="div3">
                      <img src="/assets/images/qrpay.png" alt="qr" />
                    </div>
                    <div className="div4">
                      <button type="button" className="save">
                        <img src="/assets/icons/farm.svg" alt="save" /> บันทึก
                      </button>
                      <button type="button" className="refresh">
                        <img src="/assets/icons/reload.svg" alt="save" /> รีเฟรช
                      </button>
                    </div>
                    <div className="div5">วิธีการชำระเงิน</div>
                    <div className="div6">
                      <p>1.บันทึกภาพ หรือ แคปหน้าจอ QR Code</p>
                      <p>2.เข้าแอปพลิเคชั่นธนาคารที่ต้องการทำรายการฝาก</p>
                      <p className="danger">ต้องใช้บัญชีที่ผูกกับระบบทำรายการเข้ามาเท่านั้น</p>
                      <p>3.กดเลือกสแกนจ่ายที่แอปธนาคารนั้น ๆ</p>
                      <p>4.เลือกรูปภาพ QR Code ที่บันทึกหรือแคป เพื่อทำรายการจ่าย</p>
                    </div>
                    <div style={{ textAlign: "center", marginTop: 10, fontSize: 12 }}>
                      <div>
                        {t("FoundProblem")}
                        <span
                          style={{
                            color: "red",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          {t("ContactCustomerService")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- end modal qr --> */}

      {/* <!-- slip verify modal --> */}
      <div className="modal fade" id="slipVerify" tabindex="-1" aria-labelledby="slipVerifyLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-border">
            <div className="modal-content">
              <div className="modal-header-container">
                <div className="modal-header">
                  <img
                    src="/assets/icons/icon-back-modal.svg"
                    className="modal-icon-back"
                    alt=""
                    data-bs-toggle="modal"
                    data-bs-target="#depositWithdraw"
                    data-bs-dismiss="modal"
                  />
                  <p className="modal-title">Slip Verify</p>
                  <img src="/assets/icons/icon-close-modal.svg" className="modal-icon-close" data-bs-dismiss="modal" aria-label="Close" alt="" />
                </div>
              </div>
              <div className="modal-body">
                <div className="slip-verify-content flexCenter">
                  <p className="warning-text">*{t("UsedInCasesWhere")}*</p>

                  <select className="select-promotion" onChange={(event) => _getBankAgentCode(event?.target?.value)}>
                    <option>{t("ChooseABank")}</option>
                    {dataFromLogin?.info?.bankDeposit?.length > 0 &&
                      dataFromLogin?.info?.bankDeposit?.map((bank) => (
                        <option key={bank?.index} value={bank?.id}>
                          {bank?.s_fname_th}
                        </option>
                      ))}
                  </select>
                  <select className="select-promotion" onChange={(event) => setPromotionCode(event?.target?.value)}>
                    <option>{t("ChooseApromotion")}</option>
                    {dataPromotion?.length > 0 &&
                      dataPromotion?.map((promotion) => (
                        <option key={promotion?.index} value={promotion?.s_code}>
                          {promotion?.s_promotion}
                        </option>
                      ))}
                  </select>
                  <div>
                    <input id="fileslip" onChange={handleFileChange} style={{ background: "#FFF", color: "#000", width: "100%" }} type="file" />
                  </div>
                  <button type="button" style={{ width: 120 }} onClick={uploadFile} className="button-warning">
                    <img style={{ width: 20, height: 20 }} src="/assets/images/icons8-send-50.png" alt="send" />
                    {t("upslip")}
                  </button>
                  <p>
                    {t("FoundProblem")} <a style={{ color: "red" }}>{t("ContactCustomerService")}</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- slip verify end --> */}

      {/* <!-- history modal --> */}
      <div className="modal fade" id="historyModal" tabindex="-1" aria-labelledby="historyModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-border">
            <div className="modal-content">
              <div className="modal-header-container">
                <div className="modal-header">
                  <p className="modal-title">{tabs}</p>
                  <img src="/assets/icons/icon-close-modal.svg" className="modal-icon-close" data-bs-dismiss="modal" aria-label="Close" alt="" />
                </div>
              </div>
              <div className="modal-body">
                <div className="history-modal-content">
                  <div className="history-tab">
                    <div
                      className={tabName === "tab-deposit" ? "history-tab-item active" : "history-tab-item"}
                      onClick={() => _clickTabDeposit("tab-deposit")}
                      onKeyDown={() => ""}
                      id="tab-deposit"
                    >
                      {t("Deposit")}
                    </div>
                    <div
                      className={tabName === "tab-withdraw" ? "history-tab-item active" : "history-tab-item"}
                      onClick={() => _clickTabDeposit("tab-withdraw")}
                      onKeyDown={() => ""}
                      id="tab-withdraw"
                    >
                      {t("Withdraw")}
                    </div>
                    <div
                      className={tabName === "tab-bonus" ? "history-tab-item active" : "history-tab-item"}
                      onClick={() => _clickTabDeposit("tab-bonus")}
                      onKeyDown={() => ""}
                      id="tab-bonus"
                    >
                      {t("bonus")}
                    </div>
                  </div>
                  {/* <!-- ฝาก --> */}
                  <div className="history-deposit" style={{ display: tabName === "tab-deposit" ? "block" : "none" }}>
                    {dataHistoryDeposit?.length > 0 &&
                      dataHistoryDeposit?.map((deposit, index) => (
                        <div className="history-list" key={deposit?.index}>
                          <div className="history-list-left">
                            <label className="history-list-label">{t("DepositList")}</label>
                            <p className="history-list-label">{deposit?.f_amount}</p>
                            <p className="history-list-label">
                              {t("Remark")} : {deposit?.s_remark}
                            </p>
                          </div>
                          <div className="history-list-right">
                            <div
                              className={`history-status${
                                deposit?.s_status === "Y" ? " success" : deposit?.s_status === "C" ? " cancel" : " not-success"
                              }`}
                            >
                              {deposit?.s_status === "Y" ? t("Complete") : deposit?.s_status === "C" ? t("cancel") : t("unsuccessful")}
                            </div>
                            <p className="history-date">{deposit?.d_datetime}</p>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* <!-- ถอน --> */}
                  <div className="history-withdraw" style={{ display: tabName === "tab-withdraw" ? "block" : "none" }}>
                    {dataHistoryWithdraw?.length > 0 &&
                      dataHistoryWithdraw?.map((withdraw, index) => (
                        <div className="history-list" key={withdraw?.index}>
                          <div className="history-list-left">
                            <label className="history-list-label">{t("WithdrawalList")}</label>
                            <p className="history-list-label">{withdraw?.f_amount}</p>
                            <p className="history-list-label">
                              {t("Remark")} : {withdraw?.s_remark}
                            </p>
                          </div>
                          <div className="history-list-right">
                            <div
                              className={`history-status${
                                withdraw?.s_status === "Y" ? " success" : withdraw?.s_status === "C" ? " cancel" : " not-success"
                              }`}
                            >
                              {withdraw?.s_status === "Y" ? t("Complete") : withdraw?.s_status === "C" ? t("cancel") : t("unsuccessful")}
                            </div>
                            <p className="history-date">{withdraw?.d_datetime}</p>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* <!-- โบนัส --> */}
                  <div className="history-bonus" style={{ display: tabName === "tab-bonus" ? "block" : "none" }}>
                    {dataHistoryBonus?.length > 0 &&
                      dataHistoryBonus?.map((bonus, index) => (
                        <div className="history-list" key={bonus?.index}>
                          <div className="history-list-left">
                            <label className="history-list-label">{t("BonusItems")}</label>
                            <p className="history-list-label">{bonus?.f_amount}</p>
                            <p className="history-list-label">
                              {t("Remark")} : {bonus?.s_remark}
                            </p>
                          </div>
                          <div className="history-list-right">
                            <div
                              className={`history-status${
                                bonus?.s_status === "Y" ? " success" : bonus?.s_status === "C" ? " cancel" : " not-success"
                              }`}
                            >
                              {bonus?.s_status === "Y" ? t("Complete") : bonus?.s_status === "C" ? t("cancel") : t("unsuccessful")}
                            </div>
                            <p className="history-date">{bonus?.d_datetime}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- history modal end --> */}

      {/* <!-- bag modal --> */}
      <div className="modal fade" id="bagModal" tabindex="-1" aria-labelledby="bagModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-border">
            <div className="modal-content">
              <div className="modal-header-container">
                <div className="modal-header">
                  <p className="modal-title">{t("bag")}</p>
                  <img src="/assets/icons/icon-close-modal.svg" className="modal-icon-close" data-bs-dismiss="modal" aria-label="Close" alt="" />
                </div>
              </div>
              <div className="modal-body">
                <div className="bag-modal-content">
                  {/* <div className="bag-modal-slide-container">
                                        <img src="/assets/images/bag-background.png" alt="" />
                                    </div> */}

                  <div className="bag-modal-menu">
                    <div
                      className="bag-modal-menu-item"
                      id="promotion-modal-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#promotionModal"
                      data-bs-dismiss="modal"
                    >
                      <div className="bag-menu-img-container">
                        <img className="bag-menu-icon" src="/assets/icons/icon-promotion.svg" alt="" />
                      </div>
                      <p className="bag-modal-menu-title">{t("Promotion")}</p>
                    </div>
                    <div className="bag-modal-menu-item" data-bs-toggle="modal" data-bs-target="#depositWithdraw" data-bs-dismiss="modal">
                      <div className="bag-menu-img-container">
                        <img className="bag-menu-icon" src="/assets/icons/icon-withdraw.svg" alt="" />
                      </div>
                      <p className="bag-modal-menu-title">{t("DepositWithdraw")}</p>
                    </div>
                    <div
                      className="bag-modal-menu-item"
                      id="earn-modal-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#earnMoneyModal"
                      data-bs-dismiss="modal"
                    >
                      <div className="bag-menu-img-container">
                        <img className="bag-menu-icon" src="/assets/icons/icon-earn-money.svg" alt="" />
                      </div>
                      <p className="bag-modal-menu-title">{t("MakeMoney")}</p>
                    </div>
                    <div
                      className="bag-modal-menu-item"
                      id="earn-modal-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#earnMoneyDetailModal"
                      data-bs-dismiss="modal"
                    >
                      <div className="bag-menu-img-container">
                        <img className="bag-menu-icon" src="/assets/images/affiliate-image.svg" alt="" />
                      </div>
                      <p className="bag-modal-menu-title">{t("WithdrawAffiliate")}</p>
                    </div>
                    <div
                      className="bag-modal-menu-item"
                      id="code-modal-btn"
                      onClick={handleShowCupong}
                      // data-bs-toggle="modal"
                      // data-bs-target="#codeModal"
                      data-bs-dismiss="modal"
                    >
                      <div className="bag-menu-img-container">
                        <img className="bag-menu-icon" src="/assets/icons/icon-ticket.svg" alt="" />
                      </div>
                      <p className="bag-modal-menu-title">{t("EnterTheCode")}</p>
                    </div>

                    <div className="bag-modal-menu-item" data-bs-toggle="modal" data-bs-target="#cashbackDetail" data-bs-dismiss="modal">
                      <div className="bag-menu-img-container">
                        <img className="bag-menu-icon" src="/assets/icons/icon-back-cash.svg" alt="" />
                      </div>
                      <p className="bag-modal-menu-title">{t("ReturnTheLostAmount")}</p>
                    </div>
                    <div className="bag-modal-menu-item" data-bs-toggle="modal" data-bs-target="#spinnerModal" data-bs-dismiss="modal">
                      <div className="bag-menu-img-container">
                        <img className="bag-menu-icon" src="/assets/images/icon-teasure.svg" alt="" />
                      </div>
                      <p className="bag-modal-menu-title">{t("Wheel")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- bag modal end --> */}

      {/* <!-- promotion modal --> */}
      <div className="modal fade" id="promotionModal" tabindex="-1" aria-labelledby="promotionModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-border">
            <div className="modal-content">
              <div className="modal-header-container">
                <div className="modal-header">
                  <p className="modal-title">{t("Promotion")}</p>
                </div>
              </div>
              {/* dataPromotion */}
              <div className="modal-body">
                <div className="promotion-modal-content">
                  <div className="promotion-modal-body">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div onClick={() => _newSl("DELETE")} style={{ color: "red" }} onKeyDown={() => ""}>
                        <FontAwesomeIcon icon={faChevronCircleLeft} style={{ color: "#FFF", fontSize: 25 }} />
                      </div>
                      <div style={{ padding: 20 }}>
                        {dataPromotion?.length > 0 && (
                          <img
                            src={`data:image/jpeg;base64,${dataPromotion[nextSliderPage]?.s_source_img}`}
                            className="promotion-modal-image"
                            alt=""
                            style={{ width: "100%" }}
                          />
                        )}
                      </div>
                      <div onClick={() => _newSl("ADD")} style={{ color: "green" }} onKeyDown={() => ""}>
                        <FontAwesomeIcon icon={faChevronCircleRight} style={{ color: "#FFF", fontSize: 25 }} />
                      </div>
                    </div>
                    <hr />
                    <div>
                      <div style={{ color: "#4CAF4F" }}>
                        {t("Deposit")} {dataPromotion?.length > 0 && dataPromotion[nextSliderPage]?.f_max_amount} รับ{" "}
                        {dataPromotion?.length > 0 && dataPromotion[nextSliderPage]?.f_percen}
                      </div>
                      <div>
                        {t("Ltd")} {dataPromotion?.length > 0 && dataPromotion[nextSliderPage]?.i_per_day} {t("TimesDay")}
                      </div>
                      <div style={{ color: "yellow" }}>{t("details")}</div>
                      <div>{dataPromotion?.length > 0 && dataPromotion[nextSliderPage]?.s_detail}</div>
                    </div>
                    <div style={{ height: 10 }} />
                    <div>
                      <button
                        type="button"
                        className="modal-icon-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        alt=""
                        style={{
                          padding: 10,
                          backgroundColor: "#5E9904",
                          borderRadius: 6,
                          width: 100,
                        }}
                        onClick={() => apoverPromotion(dataPromotion[nextSliderPage])}
                      >
                        {t("GET_BONUS")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- promotion modal end --> */}

      {/* <!-- code modal --> */}
      <div className="modal fade" id="codeModal" tabindex="-1" aria-labelledby="codeModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-border">
            <div className="modal-content">
              <div className="modal-header-container">
                <div className="modal-header">
                  <img
                    src="/assets/icons/icon-back-modal.svg"
                    className="modal-icon-back"
                    alt=""
                    data-bs-toggle="modal"
                    data-bs-target="#bagModal"
                    data-bs-dismiss="modal"
                  />
                  <p className="modal-title">{t("EnterTheCode")}</p>
                  <img src="/assets/icons/icon-close-modal.svg" className="modal-icon-close" data-bs-dismiss="modal" aria-label="Close" alt="" />
                </div>
              </div>
              <div className="modal-body">
                <div className="code-modal-content">
                  <input type="text" placeholder={"PleaseEnterTheCode"} className="input-box" onChange={(e) => setCodeCupon(e.target.value)} />
                  <button type="button" className="button-warning" data-bs-dismiss="modal" onClick={() => _addCupon()}>
                    {t("confirm")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- code modal end --> */}

      {/* <!-- credit modal --> */}
      <div className="modal fade" id="creditModal" tabindex="-1" aria-labelledby="creditModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-border">
            <div className="modal-content">
              <div className="modal-header-container">
                <div className="modal-header">
                  <img
                    src="/assets/icons/icon-back-modal.svg"
                    className="modal-icon-back"
                    alt=""
                    data-bs-toggle="modal"
                    data-bs-target="#bagModal"
                    data-bs-dismiss="modal"
                  />
                  <p className="modal-title">เครดิตฟรี</p>
                  <img src="/assets/icons/icon-close-modal.svg" className="modal-icon-close" data-bs-dismiss="modal" aria-label="Close" alt="" />
                </div>
              </div>
              <div className="modal-body">
                <div className="credit-modal-content">
                  <div className="border-input-gold">
                    <div className="credit-modal-body">
                      {/* <!-- show this if thre is free credit --> */}
                      <div className="free-credit">
                        <div className="credit-point-content">
                          <img className="credit-point-img" src="/assets/images/coin.png" alt="" />
                          <p className="credit-point-text">+100</p>
                        </div>
                        <div className="credit-button-content">
                          <p className="credit-button-title">สามารถรับเครดิตฟรีได้</p>
                          <button type="button" className="btn-credit-confirm">
                            ยินยัน
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- credit modal end --> */}

      {/* <!-- diamond modal --> */}
      <div className="modal fade" id="diamondModal" tabindex="-1" aria-labelledby="diamondModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-border">
            <div className="modal-content">
              <div className="modal-header-container">
                <div className="modal-header">
                  <img
                    src="/assets/icons/icon-back-modal.svg"
                    className="modal-icon-back"
                    alt=""
                    data-bs-toggle="modal"
                    data-bs-target="#bagModal"
                    data-bs-dismiss="modal"
                  />
                  <p className="modal-title">เพชรฟรี</p>
                  <img src="/assets/icons/icon-close-modal.svg" className="modal-icon-close" data-bs-dismiss="modal" aria-label="Close" alt="" />
                </div>
              </div>
              <div className="modal-body">
                <div className="credit-modal-content">
                  <div className="border-input-gold">
                    <div className="credit-modal-body">
                      {/* <!-- show this if no credit --> */}
                      {/* <!-- <div className="no-credit">
                                          <div className="no-credit-right">
                                              <p className="no-credit-text">ไม่พบรายการ</p>
                                              <p className="no-credit-text">เพชรฟรี</p>
                                          </div>
                                      </div> --> */}

                      {/* <!-- show this if thre is free credit --> */}
                      <div className="free-credit">
                        <div className="credit-point-content">
                          <img className="credit-point-img" src="/assets/images/gem.svg" alt="" />
                          <p className="credit-point-text">+100</p>
                        </div>
                        <div className="credit-button-content">
                          <p className="credit-button-title">สามารถรับเพชรฟรีได้</p>
                          <button type="button" className="btn-credit-confirm">
                            ยินยัน
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- diamond modal end --> */}

      {/* <!-- spinner modal --> */}
      <div className="modal fade" id="spinnerModal" tabindex="-1" aria-labelledby="spinnerModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-border">
            <div className="modal-content">
              <div className="modal-header-container">
                <div className="modal-header">
                  <img
                    src="/assets/icons/icon-back-modal.svg"
                    className="modal-icon-back"
                    alt=""
                    data-bs-toggle="modal"
                    data-bs-target="#bagModal"
                    data-bs-dismiss="modal"
                  />
                  <p className="modal-title">{t("Wheel")}</p>
                  <img src="/assets/icons/icon-close-modal.svg" className="modal-icon-close" data-bs-dismiss="modal" aria-label="Close" alt="" />
                </div>
              </div>
              <div className="modal-body">
                <div className="spinner-modal-content">
                  <p className="spinner-modal-title">
                    {t("TotalPoints")} : {currentPoint}
                  </p>
                  <div className="spinner-modal-body">
                    {dataSpinWheel.length > 0 && (
                      <Roulette
                        data={dataSpinWheel}
                        setOutputSpin={setOutputSpin}
                        username={dataFromLogin?.username}
                        setCurrentPoint={setCurrentPoint}
                        setNotCurrentPoint={setNotCurrentPoint}
                      />
                    )}
                    <br />
                    <div style={{ margintTop: 10, fontWeight: 500, fontSize: 16, textDecoration: "underline" }}> {t("details")}</div>
                    <p style={{ margin: "none" }}>
                      {t("YouCanSpinAll")} {limitSpinWheel?.i_max} {t("times")} {t("RightsAlreadyExercised")} {notCurrentPoint} {t("times")}
                    </p>
                    <p style={{ margin: "none" }}>
                      {t("WithinTheDay")} {limitSpinWheel?.i_per_day} {t("times")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- spinner modal end --> */}

      {/* <!-- earn money modal --> */}
      <div className="modal fade" id="earnMoneyModal" tabindex="-1" aria-labelledby="earnMoneyModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-border">
            <div className="modal-content">
              <div className="modal-header-container">
                <div className="modal-header">
                  <img
                    src="/assets/icons/icon-back-modal.svg"
                    className="modal-icon-back"
                    alt=""
                    data-bs-toggle="modal"
                    data-bs-target="#bagModal"
                    data-bs-dismiss="modal"
                  />
                  <p className="modal-title">{t("MakeMoney")}</p>
                  <img src="/assets/icons/icon-close-modal.svg" className="modal-icon-close" data-bs-dismiss="modal" aria-label="Close" alt="" />
                </div>
              </div>
              <div className="modal-body">
                <div className="earn-modal-content">
                  <div className="border-input-gold">
                    <div className="link-shared">
                      <p className="link-shared-title">{t("ReferAFriendLink")}</p>
                      <p className="link-shared-subtitle">{t("YouwillEarnFree")}</p>
                      <input type="text" className="link-shared-input" value={dataFromLogin?.info?.shorturl} />

                      <div className="link-shared-btn-group">
                        <div className="border-input-gold border-btn">
                          <button type="button" className="btn-copy-link" onClick={() => _copyLinkAffiliate(dataFromLogin?.info?.shorturl)}>
                            {t("CopyLink")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*<------\\ history Affiliate //--------> */}
      <div className="modal fade" id="earnMoneyDetailModal" tabindex="-1" aria-labelledby="earnMoneyDetailModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-border" style={{ width: 490 }}>
            <div className="modal-content">
              <div className="modal-header-container">
                <div className="modal-header">
                  <img
                    src="/assets/icons/icon-back-modal.svg"
                    className="modal-icon-back"
                    alt=""
                    data-bs-toggle="modal"
                    data-bs-target="#bagModal"
                    data-bs-dismiss="modal"
                  />
                  <p className="modal-title">{t("AffiliateShare")}</p>
                  <img src="/assets/icons/icon-close-modal.svg" className="modal-icon-close" data-bs-dismiss="modal" aria-label="Close" alt="" />
                </div>
              </div>
              <div className="modal-body">
                <div className="earn-modal-content">
                  <div className="earn-tab-container">
                    <div className="border-input-gold">
                      <div className="earn-tab">
                        <div
                          onClick={() => _tabAffiliate("overview")}
                          onKeyDown={() => ""}
                          className={tabNameAffiliate === "overview" ? "earn-tab-item active" : "earn-tab-item"}
                        >
                          {t("Overview")}
                        </div>
                        <div className="border-input-gold earn-tab-item-2" onClick={() => _tabAffiliate("income")} onKeyDown={() => ""}>
                          <div className={tabNameAffiliate === "income" ? "earn-tab-item active" : "earn-tab-item"}>{t("income")}</div>
                        </div>
                        <div
                          onClick={() => _tabAffiliate("withdraw-income")}
                          onKeyDown={() => ""}
                          className={tabNameAffiliate === "withdraw-income" ? "earn-tab-item active" : "earn-tab-item"}
                        >
                          {t("WithdrawIncome")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="earn-detail-data" style={{ display: tabNameAffiliate === "overview" ? "block" : "none" }}>
                    <div className="filter-date">
                      <p className="filter-label">{t("DateOverview")}</p>
                      <input
                        className="filter-date-input"
                        value={overviewDate}
                        onChange={(e) => setOverviewDate(e.target.value)}
                        type="month"
                        name=""
                        id=""
                      />
                    </div>

                    <div className="border-input-gold">
                      <div className="table-earn-date">
                        <div className="border-input-gold">
                          <div className="th-earn-container">
                            <span className="th-earn">{t("date")}</span>
                            <span className="th-earn">{t("apply")}</span>
                            <span className="th-earn">{t("DepositMoney")}</span>
                            <span className="th-earn">{t("income")}</span>
                          </div>
                        </div>

                        <div className="tr-earn-container">
                          {dataOverview.length > 0 &&
                            dataOverview?.map((item, index) => (
                              <div className="tr-earn">
                                <span className="td-earn">{item?.d_create}</span>
                                <span className="td-earn">{item?.regisCount}</span>
                                <span className="td-earn">{item?.deposit}</span>
                                <span className="td-earn">{item?.f_affiliate_credit}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="filter-date">
                      <p className="filter-label">{t("MonthlyOverview")}</p>
                      <select className="filter-date-input" onChange={(event) => _selectYear(event?.target?.value)}>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="border-input-gold">
                      <div className="table-earn-date">
                        <div className="border-input-gold">
                          <div className="th-earn-container">
                            <span className="th-earn">{t("month")}</span>
                            <span className="th-earn">{t("apply")}</span>
                            <span className="th-earn">{t("DepositMoney")}</span>
                            <span className="th-earn">{t("income")}</span>
                          </div>
                        </div>

                        <div className="tr-earn-container">
                          {dataOverviewYears?.length > 0 &&
                            dataOverviewYears?.map((item, index) => (
                              <div className="tr-earn">
                                <span className="td-earn">{item?.month}</span>
                                <span className="td-earn">{item?.regisCount}</span>
                                <span className="td-earn">{item?.f_affiliate_credit}</span>
                                <span className="td-earn">{item?.deposit}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="earn-detail-data" style={{ display: tabNameAffiliate === "income" ? "block" : "none" }}>
                    <div className="filter-date">
                      <p className="filter-label">{t("IncomeHistory")}</p>
                      <div style={{ float: "right", display: "flex" }}>
                        <input
                          className="filter-date-input"
                          value={incomeDateStart}
                          onChange={(event) => _getIncomeDateStart(event)}
                          type="month"
                          name=""
                          id=""
                        />
                        <input
                          className="filter-date-input"
                          value={incomeDateEnd}
                          onChange={(event) => _getIncomeDateEnd(event)}
                          type="month"
                          name=""
                          id=""
                        />
                      </div>
                    </div>
                    <div className="border-input-gold">
                      <div className="table-earn-date">
                        <div className="border-input-gold">
                          <div className="th-earn-container">
                            <span className="th-earn">{t("BillingCycle")}</span>
                            <span className="th-earn">{t("AmountOfMoney")}</span>
                          </div>
                        </div>

                        <div className="tr-earn-container">
                          {dataIncome?.length > 0 &&
                            dataIncome?.map((item, index) => (
                              <div className="tr-earn" key={index}>
                                <div className="td-earn">{item?.d_date}</div>
                                <div className="td-earn">{item?.f_affiliate}</div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="earn-detail-data" style={{ display: tabNameAffiliate === "withdraw-income" ? "block" : "none" }}>
                    <div className="border-input-gold">
                      <div className="form-withdraw-income">
                        <div className="form-withdraw-group">
                          <label className="form-withdraw-label">{t("CurrentIncome")}</label>
                          <input type="text" value={dataFromLogin?.balance?.affiliate} className="form-withdraw-input" />
                        </div>
                        {/* <div className="form-withdraw-group">
                                                    <label className="form-withdraw-label">จำนวนเงินที่ต้องการถอน</label>
                                                    <input type="text" placeholder="ถอนไม่มีขั้นต่ำ" className="form-withdraw-input" />
                                                </div> */}

                        <button type="button" onClick={() => _getReceiveAffiliate(dataFromLogin?.balance?.affiliate)} className="btn-withdraw-income">
                          {t("WithdrawIncome")}
                        </button>
                      </div>
                    </div>
                    <br />
                    <div className="filter-date">
                      <p className="filter-label">{t("IncomeHistory")}</p>
                    </div>

                    <div className="border-input-gold">
                      <div className="table-earn-date">
                        <div className="border-input-gold">
                          <div className="th-earn-container">
                            <span className="th-earn">{t("DateTime")}</span>
                            <span className="th-earn">{t("AmountOfMoney")}</span>
                          </div>
                        </div>

                        <div className="tr-earn-container">
                          {dataHistoryAffiliate?.length > 0 &&
                            dataHistoryAffiliate?.map((item, index) => (
                              <div className="tr-earn">
                                <span className="td-earn">{item?.d_create}</span>
                                <span className="td-earn">{item?.f_amount}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*<------\\ history Affiliate //--------> */}

      {/* <!-- change password modal --> */}
      <div className="modal fade" id="changePasswordModal" tabindex="-1" aria-labelledby="changePasswordModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-border">
            <div className="modal-content">
              <div className="modal-header-container">
                <div className="modal-header">
                  <img
                    src="/assets/icons/icon-back-modal.svg"
                    className="modal-icon-back"
                    alt=""
                    data-bs-toggle="modal"
                    data-bs-target="#bagModal"
                    data-bs-dismiss="modal"
                  />
                  <p className="modal-title">{t("ChangePassword")}</p>
                  <img src="/assets/icons/icon-close-modal.svg" className="modal-icon-close" data-bs-dismiss="modal" aria-label="Close" alt="" />
                </div>
              </div>
              <div className="modal-body">
                <div className="change-password-modal-content">
                  <div className="border-input-gold">
                    <input
                      type="password"
                      placeholder={t("PleaseEnterTheOldPassword")}
                      className="input-for-border-gold"
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </div>
                  <div className="change-password-hr">
                    <div className="hr" />
                  </div>
                  <div className="border-input-gold">
                    <input
                      type="password"
                      placeholder={t("PleaseEnterNewPassword")}
                      className="input-for-border-gold"
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="border-input-gold">
                    <input
                      type="password"
                      placeholder={t("PleaseEnterYourPasswordAgain")}
                      className="input-for-border-gold"
                      onChange={(e) => setNewPasswordVery(e.target.value)}
                    />
                  </div>
                  <div style={{ textAlign: "center", color: "red" }}>{reMessage}</div>
                  <button type="button" className="button-warning" onClick={() => _ChangePassword()}>
                    {t("confirm")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- confirm logout modal --> */}
      <div className="modal fade" id="confirmLogout" tabindex="-1" aria-labelledby="confirmLogoutLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-border">
            <div className="modal-content">
              <div className="modal-header-container">
                <div className="modal-header">
                  <p className="modal-title">{t("ConfirmLogout")}</p>
                </div>
              </div>
              <div className="modal-body">
                <div className="code-modal-content" style={{ textAlign: "center" }}>
                  <div>{t("DoYouWantToLog")}</div>
                </div>
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center" }}>
                  <a href={Constant?.LINK_WORDPRESS} className="btn-confirm-logout">
                    {" "}
                    {t("confirm")}
                  </a>
                  <button type="button" className="btn-cancel-confirm-logout" data-bs-dismiss="modal">
                    {t("cancel")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- confirm logout modal end --> */}

      {/* <!-- confirm logout modal --> */}
      <div className="modal fade" id="historyCashback" tabindex="-1" aria-labelledby="history-cashbackLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-border">
            <div className="modal-content">
              <div className="modal-header-container">
                <div className="modal-header">
                  <img
                    src="/assets/icons/icon-back-modal.svg"
                    className="modal-icon-back"
                    alt=""
                    data-bs-toggle="modal"
                    data-bs-target="#cashbackDetail"
                    data-bs-dismiss="modal"
                  />
                  <p className="modal-title">{t("ReceiptHistory")}</p>
                  <img
                    src="/assets/icons/icon-close-modal.svg"
                    className="modal-icon-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    alt="shun808"
                  />
                </div>
              </div>
              <div className="modal-body">
                <div
                  style={{
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "20px",
                    width: "100%",
                    marginTop: 20,
                  }}
                >
                  <div>{t("DateAndTime")}</div>
                  <div>{t("AmountOfMoney")}</div>
                </div>
                <b />
                {historyCashBack?.length > 0 &&
                  historyCashBack?.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        color: "white",
                        display: "flex",
                        width: "90%",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>{item?.d_create}</div>
                      <div>{item?.f_amount}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- confirm logout modal end --> */}

      {/* <!-- Modal --> */}

      <footer className="footer" style={{ zIndex: 5 }}>
        <div className="menu-wrapper">
          <div className="footer-item flexCenter" data-bs-toggle="modal" data-bs-target="#historyModal">
            <img src="/assets/icons/History.svg" alt="login" />
            <p className="font-20">{t("Record")}</p>
          </div>
          <div className="footer-item flexCenter" data-bs-toggle="modal" data-bs-target="#promotionModal" data-bs-dismiss="modal">
            <img src="/assets/icons/gift.svg" alt="login" />
            <p className="font-20">{t("Promotion")}</p>
          </div>
          <div className="footer-item flexCenter" data-bs-toggle="modal" data-bs-target="#depositWithdraw">
            <img src="/assets/icons/return-money.svg" alt="login" />
            <p className="font-20">{t("DepositWithdraw")}</p>
          </div>
          <div className="footer-item flexCenter" data-bs-toggle="modal" data-bs-target="#bagModal">
            <img src="/assets/icons/money-bag.svg" alt="login" />
            <p className="font-20">{t("bag")}</p>
          </div>
          <a target="_blank" href={linkLine} className="footer-item flexCenter" style={{ textDecoration: "none" }} rel="noreferrer">
            <img src="/assets/images/contact-admin.svg" alt="login" />
            <p className="font-20">{t("ContactUs")}</p>
          </a>
        </div>
      </footer>

      <Modal show={show} style onHide={handleClose}>
        <div className="modal-border">
          <div className="modal-content">
            <div className="modal-header-container">
              <div className="modal-header">
                <p className="modal-title" id="autoDeposit">
                  {t("AutoDeposit")}
                </p>
              </div>
            </div>
            <div className="modal-body">
              <div className="detail-card-scb1">
                <div className="card-scb1" style={{ background: depositBankList && depositBankList?.background }}>
                  <div className="left">
                    <p>{depositBankList && depositBankList?.s_fname_th}</p>
                    <p>{depositBankList && depositBankList?.s_account_name}</p>
                    <p>
                      {depositBankList && depositBankList?.s_account_no}
                      <span>
                        <img
                          src="/assets/images/icon-coppy.svg"
                          onClick={() => _copyAccountNo(depositBankList?.s_account_no)}
                          alt=""
                          style={{ width: 30, height: 30, marginBottom: -3 }}
                        />
                      </span>
                    </p>
                  </div>
                  <div className="right">
                    <div className="bank">
                      <h3 style={{ textTransform: "uppercase" }}>{depositBankList && depositBankList?.s_icon.split(".")[0]}</h3>
                      <div style={{ borderRadius: "100%", marginTop: -10 }}>
                        <img src={`/assets/images/bank/${depositBankList && depositBankList?.s_icon}`} alt="scb" />
                      </div>
                    </div>
                    <div style={{ marginLeft: 50 }}>
                      <div className="deposit-bank-title-pc">{t("ChangeBank")}</div>
                      <img
                        onClick={() => _getOptionBank()}
                        onKeyDown={() => ""}
                        style={{ width: 30, height: 30, display: disableArrow === true ? "none" : "block", cursor: "pointer" }}
                        src="/assets/images/arrow-bottom.svg"
                        alt=""
                      />
                      <select
                        onChange={(e) => _getOptionBank2(e.target.value)}
                        className="deposit-bank-list-pc"
                        style={{ display: disableArrow === true ? "block" : "none" }}
                      >
                        {dataFromLogin?.info?.bankDeposit?.length > 0 &&
                          dataFromLogin?.info?.bankDeposit?.map((bank) => (
                            <option key={bank?.index} value={JSON.stringify(bank)}>
                              {bank?.s_fname_th}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "center", marginTop: 10, fontSize: 14 }}>
                <div>
                  {" "}
                  {t("FoundProblem")} <span>{t("ContactCustomerService")}</span>
                </div>
              </div>
              {/* <div className="button-line">
                                <div>
                                    <img
                                        src="/assets/icons/icon-line.svg"
                                        style={{ width: 28, height: 28 }}
                                        alt="line"
                                    />
                                    ไลน์บอท / แจ้งเตือนยอดฝาก - ถอน
                                </div>
                            </div> */}
            </div>
          </div>
        </div>
      </Modal>
      <Modal show={showCupong} style onHide={handleCloseCupong}>
        <div className="modal-border">
          <div className="modal-content">
            <div className="modal-header-container">
              <div className="modal-header">
                <img
                  src="/assets/icons/icon-back-modal.svg"
                  className="modal-icon-back"
                  alt=""
                  onClick={handleCloseCupong}
                  // data-bs-toggle="modal"
                  // data-bs-target="#bagModal"
                  // data-bs-dismiss="modal"
                />
                <p className="modal-title">{t("EnterTheCode")}</p>
                <img
                  alt=""
                  onClick={() => handleCloseCupong()}
                  src="/assets/icons/icon-close-modal.svg"
                  className="modal-icon-close"
                  // data-bs-dismiss="modal"
                  // aria-label="Close"
                />
              </div>
            </div>
            <div className="modal-body">
              <div className="code-modal-content">
                <input type="text" placeholder={"PleaseEnterTheCode"} className="input-box" onChange={(e) => setCodeCupon(e.target.value)} />
                <button type="button" className="button-warning" data-bs-dismiss="modal" onClick={() => _addCupon()}>
                  {t("confirm")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {/* <ToastContainer position="top-right" autoClose={2000} /> */}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
