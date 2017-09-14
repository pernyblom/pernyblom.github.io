package com.springworldgames.swing.valuecomponents;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.HashMap;

import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JLabel;

import com.springworldgames.objectreader.ReadableObject;
import com.springworldgames.objectreader.ObjectReader;

public class ReadableObjectButtonWithLabel extends ValueComponent {

	ReadableObject currentObject;
	private PFAContainerValueComponent component;
	private PFAContainerValueComponentDialog dialog;
	private JButton editButton;

	@Override
	public void setEnabled(boolean enabled) {
		super.setEnabled(enabled);
		editButton.setEnabled(enabled);
	}
	
	@Override
	public Object getCurrentValue() {
		return currentObject;
	}

	@Override
	protected void setCurrentVerifiedValue(Object verifiedValue) {
		currentObject = (ReadableObject) verifiedValue;
		component.setCurrentVerifiedValue(verifiedValue);
	}
	
	public ReadableObjectButtonWithLabel(String propertyName, String caption,
			final ReadableObject object, final ObjectReader reader,
			final HashMap<String, ReadableObject> allObjects) {
		super(propertyName);

		currentObject = object;
		setLayout(new BoxLayout(this, BoxLayout.X_AXIS));

		if (caption != null) {
			JLabel label = new JLabel(caption);
			label.setAlignmentX(0.0f);
			add(label);
		}

		editButton = new JButton("Edit " + propertyName);
		editButton.setAlignmentX(1.0f);
		component = new PFAContainerValueComponent(
				propertyName, caption, object, allObjects, reader);
		dialog = new PFAContainerValueComponentDialog(
				component);
		
		editButton.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent arg0) {
				dialog.setVisible(true);
				informAllListeners(null, object);
			}
		});

		add(Box.createHorizontalGlue());
		add(editButton);
	}

}
