package com.blockChain.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blockChain.service.SalesSvcInter;

@RestController
@RequestMapping("/api/cardPack")
public class CardPackController {
	@Autowired
	SalesSvcInter salesSvc;
	@GetMapping("/{cardpackPK}/review")
	public Map<String,Object> sltReviewList(
		    @PathVariable(name="cardpackPK") Long cardpackPK
			){
		System.out.println("here1");
		return salesSvc.sltReviewList(cardpackPK);
		
	}
	@PostMapping("/{cardpackPK}/create/review")
	public Map<String,Object>insertReview(
			@PathVariable(name="cardpackPK") Long cardpackPK,
			@RequestBody Map<String, Object> req 
			){
		return salesSvc.insertReview(cardpackPK, req);
	}
}