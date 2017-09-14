package com.springworldgames.objectreader;

import java.util.HashMap;

import com.springworldgames.objectreader.common.PropertyFieldAssociationContainer;
import com.springworldgames.objectreader.common.PropertyHolder;

// Change this to ReadableObject later!
public interface ReadableObject extends PropertyHolder, XMLWritable, PropertyFieldAssociationContainer {

	public boolean instantiateChildren();

	public Object getFieldProperty(String attrName);

//	public boolean canHandleFieldSetFor(String attrName);
//
//	public void setHandledField(String attrName, String value);

	public String getId();

	public String idHint();

	public void clear();
	
	public void init(HashMap<String, ReadableObject> allObjects,
			ObjectReader reader) throws Exception;
}
