package com.blockChain.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.blockChain.domain.Celeb;
import com.blockChain.domain.Celeb_Like;
import com.blockChain.domain.Member;
import com.blockChain.domain.Member_Grade;
import com.blockChain.domain.RefreshToken;
import com.blockChain.dto.TokenDto;
import com.blockChain.jwt.TokenProvider;
import com.blockChain.repository.CelebRepo;
import com.blockChain.repository.Celeb_LikeRepo;
import com.blockChain.repository.MemberRepo;
import com.blockChain.repository.Member_GradeRepo;
import com.blockChain.repository.RefreshTokenRepository;

@Service
@Transactional
public class MemberSvcImpl implements MemberSvcInter{

	@Autowired
	private MemberRepo memberRepo;
	@Autowired
	private Member_GradeRepo mgRepo;
	@Autowired
	private CelebRepo celebRepo;
	@Autowired
	private Celeb_LikeRepo clRepo;
	@Autowired
	private AuthenticationManagerBuilder authenticationManagerBuilder;
	@Autowired
	private TokenProvider tokenProvider;
	@Autowired
	private RefreshTokenRepository refreshTokenRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Override
	public Map<String,Object> signup(Map<String, Object> req){
		 Map<String, Object> res = new HashMap<String,Object>();
		 String memberId = (String)req.get("memberId");
		 String memberEmail = (String)req.get("memberEmail");
		 String memberNick = (String)req.get("memberNick");
		 try {
		 memberRepo.checkId(memberId).ifPresent(m ->{throw new IllegalStateException("이미 존재하는 아이디입니다.");});
		 memberRepo.checkEmail(memberEmail).ifPresent(m ->{throw new IllegalStateException("이미 존재하는 이메일입니다.");});
		 memberRepo.checkNick(memberNick).ifPresent(m->{throw new IllegalStateException("이미 존재하는 별명입니다.");});
		 Member member = new Member();
		 Optional<Member_Grade> mg = mgRepo.sltByNM("팬");
		 String pw = (String)req.get("memberPw");
		 member.setMemberEmail(memberEmail);
		 member.setMemberGrade(mg.get());
		 member.setMemberId(memberId);
		 member.setMemberNick(memberNick);
		 member.setMemberPw(passwordEncoder.encode(pw));
		 member.setMemberPhone((String)req.get("memberPhone"));
		 Member savedMember = memberRepo.save(member);
		 res.put("msg", "회원가입 성공");
		 List<?> celebNo = (List<?>) req.get("likeCeleb");
		 System.out.println(celebNo);
		 int cnt = 0;
		 for(int i =0;i<celebNo.size();i++) {
			 cnt++;
			 Optional<Celeb> celebOne =celebRepo.findById(Long.valueOf(celebNo.get(i).toString()));
			 Celeb_Like cl = new Celeb_Like();
			 cl.setCeleb(celebOne.get());
			 cl.setMember(savedMember);
			 Celeb_Like savedCL = clRepo.save(cl);
			 res.put("celebLike"+cnt,"샐럽 좋아요 성공 : "+savedCL.getCeleb().getCelebNo());
		 }
		 } catch(IllegalStateException e) {
				res.put("success", false);
				res.put("msg", e.getMessage());
				return res;
		 }
		 return res;
	}
	@Override
	public TokenDto login(Member member) {

		// 유저 정보 검증

		// -------- 토큰 생성
		// 유저 id, password를 통해 UsernamePasswordAuthenticationToken객체 생성
		UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
				member.getMemberId(), member.getMemberPw());
		System.out.println(member.getMemberId() + " " + member.getMemberPw());
		// authenticationToken를 이용해서 authenticate메소드가 실행이 될때
		// 아까만든 CustomUserDetailsService의 loadUserByUsername 메소드가 실행됨
		// 그 결과값을 가지고 Authentication객체가 생성됨
		System.out.println(authenticationToken);
		Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
//        SecurityContextHolder.getContext().setAuthentication(authentication);//Authentication객체를 SecurityContext에 저장

		// memberName 가져와서 토큰만들때 집어넣음
		String memberId = memberRepo.checkId(member.getMemberId()).get().getMemberId();
		System.out.println(memberId);
		// Authentication를 이용해 jwt토큰 생성
		TokenDto jwt = tokenProvider.generateTokenDto(authentication, memberId);
		System.out.println(jwt);
		// -------- 토큰 생성완료

		// RefreshToken 저장
		RefreshToken refreshToken = RefreshToken.builder().key(authentication.getName()).value(jwt.getRefreshToken())
				.build();
		System.out.println(refreshToken);
		refreshTokenRepository.save(refreshToken);

		return jwt;
	}
	@Override
	public Map<String,Object> checkId(Map<String, Object> req){
		Map<String, Object> res = new HashMap<String,Object>();
		String memberId = (String)req.get("memberId");
		try {
			memberRepo.checkId(memberId).ifPresent(m ->{throw new IllegalStateException("이미 존재하는 아이디입니다.");});
			res.put("msg", "아이디 중복체크 통과");
			res.put("success", true);

		} catch(IllegalStateException e) {
			res.put("success", false);
			res.put("msg", e.getMessage());
			return res;
		}
		return res;
	}
	@Override
	public Map<String,Object> checkNick(Map<String, Object> req){
		Map<String, Object> res = new HashMap<String,Object>();
		 String memberNick = (String)req.get("memberNick");
		try {
			 memberRepo.checkNick(memberNick).ifPresent(m->{throw new IllegalStateException("이미 존재하는 별명입니다.");});
			res.put("msg", "닉네임 중복체크 통과");
			res.put("success", true);
		} catch(IllegalStateException e) {
			res.put("success", false);
			res.put("msg", e.getMessage());
			return res;
		}
		return res;
	}
	@Override
	public Map<String,Object> checkEmail(Map<String, Object> req){
		Map<String, Object> res = new HashMap<String,Object>();
		String memberEmail = (String)req.get("memberEmail");
		try {
			 memberRepo.checkEmail(memberEmail).ifPresent(m ->{throw new IllegalStateException("이미 존재하는 이메일입니다.");});
			res.put("msg", "이메일 중복체크 통과");
			res.put("success", true);

		} catch(IllegalStateException e) {
			res.put("success", false);
			res.put("msg", e.getMessage());
			return res;
		}
		return res;
	}
}
