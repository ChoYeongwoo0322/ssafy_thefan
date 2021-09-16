import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { myPageMenu } from "../../../redux/actions";
import "./MyPageBodyLeft.css";

interface MyPageBodyLeftProps {
  myPageMenu: any;
}

function MyPageBodyLeft(props: MyPageBodyLeftProps): JSX.Element {
  const { myPageMenu } = props;

  return (
    <div className="mypageBodyLeft">
      <h1>쇼핑 정보</h1>
      <hr />
      <p onClick={() => myPageMenu(0)}>구매 내역</p>
      <p onClick={() => myPageMenu(1)}>관심 상품</p>

      <br />

      <h1>경매 정보</h1>
      <hr />
      <p onClick={() => myPageMenu(2)}>내가 등록한 경매</p>
      <p onClick={() => myPageMenu(3)}>경매 내역</p>
      <p onClick={() => myPageMenu(4)}>관심 경매</p>

      <br />

      <h1>고객센터</h1>
      <hr />

      <Link
        to={{
          pathname: "/service/id",
          state: {
            index: 1,
          },
        }}
        style={{ textDecoration: "none" }}
      >
        <p className="menuService">1:1 문의</p>
      </Link>
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return {
    myPageMenu: state.myPageMenu,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    myPageMenu: (id: number) => dispatch(myPageMenu(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPageBodyLeft);
