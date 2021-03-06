import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TextField, Button } from "@material-ui/core";
import axios from "axios";
import JoinAlert from "./JoinAlert";
import "./JoinTable.css";

interface JoinTableProps {
  handleJoinRes: any;
}

function JoinTable(props: JoinTableProps): JSX.Element {
  const { handleJoinRes } = props;

  const [memberId, setMemberId] = useState<string>("");
  const [memberIdCheck, setMemberIdCheck] = useState<number>(0);
  const [memberPw, setMemberPw] = useState<string>("");
  const [memberPwCheck, setMemberPwCheck] = useState<number>(0);
  const [password2, setPassword2] = useState<string>("");
  const [memberNick, setMemberNick] = useState<string>("");
  const [nickCheck, setNickCheck] = useState<number>(0);
  const [memberEmail, setMemberEmail] = useState<string>("");
  const [emailCheck, setEmailCheck] = useState<number>(0);
  const [checkEmail, setCheckEmail] = useState<boolean>(true);
  const [likeCeleb, setLikeCeleb] = useState<number>(999);
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleMemberId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberId(e.target.value.trim());
    if (memberId !== e.target.value) {
      setMemberIdCheck(0);
    }
  };

  const handleMemberIdCheck = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (memberId.trim().match(/^[a-zA-Z0-9+]{5,15}$/)) {
      axios.post("/api/member/checkId", { memberId: memberId }).then((res) => {
        if (res.data.success) {
          setMessage("사용 가능한 아이디입니다");
          setMemberIdCheck(1);
          setOpen(true);
        } else {
          setMemberIdCheck(2);
        }
      });
    } else {
      setMemberIdCheck(3);
    }
  };

  const handleMemberPw = (e: string) => {
    if (
      e
        .trim()
        .match(
          /(?=.*\d{1,50})(?=.*[-~`!@#$%&*()+=^]{1,50})(?=.*[a-zA-Z]{1,50}).{8,16}$/
        )
    ) {
      setMemberPwCheck(1);
      setMemberPw(e);
    } else {
      setMemberPwCheck(2);
    }
  };

  const handlePassword2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword2(e.target.value);
  };

  const handleMemberNick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberNick(e.target.value.trim());
    if (memberNick !== e.target.value) {
      setNickCheck(0);
    }
  };

  const handleNickCheck = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (memberNick.trim()) {
      axios
        .post("/api/member/checkNick", { memberNick: memberNick })
        .then((res) => {
          if (res.data.success) {
            setMessage("사용 가능한 닉네임입니다");
            setNickCheck(1);
            setOpen(true);
          } else {
            setNickCheck(2);
          }
        });
    } else {
      setMessage("닉네임을 입력해 주세요");
      setOpen(true);
    }
  };

  const handleMemberEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberEmail(e.target.value.trim());
    if (
      memberEmail.match(
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[com]{2,3}$/
      )
    ) {
      setCheckEmail(true);
      if (memberEmail !== e.target.value) {
        setEmailCheck(0);
      }
    } else {
      setCheckEmail(false);
    }
  };

  const handleEmailCheck = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (
      memberEmail
        .trim()
        .match(
          /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/
        )
    ) {
      axios
        .post("/api/member/checkEmail", { memberEmail: memberEmail })
        .then((res) => {
          if (res.data.success) {
            setMessage("사용 가능한 이메일입니다");
            setEmailCheck(1);
            setOpen(true);
          } else {
            setEmailCheck(2);
          }
        });
    } else {
      setMessage("이메일을 입력해 주세요");
      setOpen(true);
    }
  };

  const handleJoin = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (
      memberId &&
      memberPw &&
      memberPwCheck === 1 &&
      memberNick &&
      memberEmail &&
      checkEmail &&
      likeCeleb !== 999
    ) {
      if (memberPw === password2) {
        if (memberIdCheck === 1 && emailCheck === 1 && nickCheck === 1) {
          axios
            .post("/api/member/signup", {
              memberId: memberId,
              memberPw: memberPw,
              memberEmail: memberEmail,
              memberNick: memberNick,
              likeCeleb: likeCeleb,
            })
            .then((res) => {
              handleJoinRes();
            })

        } else {
          setMessage("중복 확인을 해 주세요");
          setOpen(true);
        }
      } else {
        setMessage("비밀번호와 비밀번화 확인이 동일하지 않습니다");
        setOpen(true);
      }
    } else {
      setMessage("필수 입력 항목들을 확인해 주세요");
      setOpen(true);
    }
  };

  return (
    <div>
      {open ? (
        <JoinAlert message={message} handleClose={handleClose} open={open} />
      ) : null}
      <table className="joinTable">
        <h1>JOIN</h1>
        <tbody>
          <tr id="joinId">
            <th>
              <span className="require">●</span>
              <span>아이디</span>
            </th>
            <td>
              <TextField
                id="standard-basic"
                onChange={handleMemberId}
                helperText={
                  memberIdCheck === 2
                    ? "이미 존재하는 아이디입니다"
                    : "영문/숫자, 5~15자"
                }
                error={
                  memberIdCheck === 2
                    ? true
                    : memberIdCheck === 3
                    ? true
                    : false
                }
              />
              <Button
                className="joinCheckBtn"
                variant="outlined"
                size="small"
                onClick={handleMemberIdCheck}
                disabled={memberIdCheck === 1 ? true : false}
              >
                중복 확인
              </Button>
            </td>
          </tr>
          <tr id="joinPw1">
            <th>
              <span className="require">●</span>
              <span>비밀번호</span>
            </th>
            <td>
              <TextField
                id="standard-basic"
                type="password"
                helperText="영문, 숫자, -~`!@#$%&*()+=^, 8~16자"
                error={memberPwCheck === 2 ? true : false}
                onChange={(e) => handleMemberPw(e.target.value)}
              />
            </td>
          </tr>
          <tr id="joinPw2">
            <th>
              <span className="require">●</span>
              <span>비밀번호 확인</span>
            </th>
            <td>
              <TextField
                id="standard-basic"
                type="password"
                onChange={handlePassword2}
                helperText={
                  memberPw !== password2 ? "비밀번호가 일치하지 않습니다" : ""
                }
                error={memberPw !== password2 ? true : false}
              />
            </td>
          </tr>
          <tr id="joinNick">
            <th>
              <span className="require">●</span>
              <span>닉네임</span>
            </th>
            <td>
              <TextField
                id="standard-basic"
                onChange={handleMemberNick}
                helperText={
                  nickCheck === 2 ? "이미 존재하는 닉네임입니다" : "8자 이하"
                }
                error={nickCheck === 2 ? true : false}
                inputProps={{
                  maxlength: 8,
                }}
              />
              <Button
                className="joinCheckBtn"
                variant="outlined"
                size="small"
                onClick={handleNickCheck}
                disabled={nickCheck === 1 ? true : false}
              >
                중복 확인
              </Button>
            </td>
          </tr>
          <tr id="joinNick">
            <th>
              <span className="require">●</span>
              <span>이메일</span>
            </th>
            <td>
              <TextField
                id="standard-basic"
                type="email"
                onChange={handleMemberEmail}
                autoComplete="email"
                helperText={
                  checkEmail
                    ? emailCheck === 2
                      ? "이미 존재하는 이메일입니다"
                      : ""
                    : "유효하지 않은 메일입니다"
                }
                error={checkEmail ? (emailCheck === 2 ? true : false) : true}
              />
              <Button
                className="joinCheckBtn"
                variant="outlined"
                size="small"
                onClick={handleEmailCheck}
                disabled={emailCheck === 1 ? true : false}
              >
                중복 확인
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="joinSelectCeleb">
        <div className="joinCelebInfo">
          <span className="require">●</span>
          <span>CELEB 선택</span>
          <span className="joinCelebSubInfo">
            좋아하는 CELEB을 선택해 주세요
          </span>
        </div>
        <div className="joinCelebBoxs">
          <div
            className="joinCelebBox joinKim"
            onClick={() => setLikeCeleb(0)}
            style={{
              backgroundColor:
                likeCeleb === 0 ? "rgba(16, 0, 247, 0.329)" : undefined,
            }}
          >
            태연
          </div>
          <div
            className="joinCelebBox joinTi"
            onClick={() => setLikeCeleb(1)}
            style={{
              backgroundColor:
                likeCeleb === 1 ? "rgba(248, 10, 248, 0.329)" : undefined,
            }}
          >
            티파니
          </div>
          <div
            className="joinCelebBox joinSeo"
            onClick={() => setLikeCeleb(2)}
            style={{
              backgroundColor:
                likeCeleb === 2 ? "rgb(241, 162, 13, 0.329)" : undefined,
            }}
          >
            서현
          </div>
          <div
            className="joinCelebBox joinHyun"
            onClick={() => setLikeCeleb(3)}
            style={{
              backgroundColor:
                likeCeleb === 3 ? "rgba(235, 12, 49, 0.329)" : undefined,
            }}
          >
            현아
          </div>
          <div
            className="joinCelebBox joinGd"
            onClick={() => setLikeCeleb(4)}
            style={{
              backgroundColor:
                likeCeleb === 4 ? "rgba(235, 231, 12, 0.329)" : undefined,
            }}
          >
            G-DRAGON
          </div>
          <div
            className="joinCelebBox joinIu"
            onClick={() => setLikeCeleb(5)}
            style={{
              backgroundColor:
                likeCeleb === 5 ? "rgba(176, 235, 12, 0.329)" : undefined,
            }}
          >
            아이유
          </div>
        </div>
      </div>
      <div className="joinBtns">
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button className="joinCancelBtn" variant="contained">
            취소
          </Button>
        </Link>
        <Button
          className="joinBtn"
          variant="contained"
          color="primary"
          onClick={handleJoin}
        >
          회원가입
        </Button>
      </div>
    </div>
  );
}

export default JoinTable;
