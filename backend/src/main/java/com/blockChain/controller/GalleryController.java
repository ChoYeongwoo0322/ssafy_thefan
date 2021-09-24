package com.blockChain.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blockChain.service.GallerySvcInter;

@RestController
@RequestMapping("/api/gallery")
public class GalleryController {
	@Autowired
	GallerySvcInter gSvc;
	
	@GetMapping("/main")
	public Map<String,Object> galleryMain(){
		return gSvc.galleryMain();
	}
	
	@GetMapping("/{memberNo}/{arraydiv1}/{celebPk}/{arraydiv2}")
	public Map<String, Object>galleryList(
			@PathVariable(name="memberNo") Long memberNo,
			@PathVariable(name="arraydiv1") Long arraydiv1,
			@PathVariable(name="celebPk") Long celebPk,
			@PathVariable(name="arraydiv2") Long arraydiv2
			){
		return gSvc.galleryList(memberNo, arraydiv1, celebPk, arraydiv2);
	}
}
