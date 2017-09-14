package com.springworldgames.swing.valuecomponents;

import java.awt.Color;
import java.awt.Container;
import java.awt.Dimension;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;

import javax.swing.BorderFactory;
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.JPanel;
import javax.swing.JTabbedPane;

import com.springworldgames.objectreader.ObjectReader;
import com.springworldgames.objectreader.ReadableObject;
import com.springworldgames.objectreader.common.PropertyFieldAssociation;

public class PFAContainerValueComponent extends ValueComponent implements
		PropertyChangeListener {

	ReadableObject currentObject;

	LinkedHashMap<String, ValueComponent> components = new LinkedHashMap<String, ValueComponent>();

	Color origBackground;

	private PropertyFieldAssociation pfa;

	@Override
	public void setEnabled(boolean enabled) {
		super.setEnabled(enabled);
		for (ValueComponent c : components.values()) {
			c.setEnabled(enabled);
		}
	}

	@Override
	public Object getCurrentValue() {
		return currentObject;
	}

	@Override
	protected void setCurrentVerifiedValue(Object verifiedValue) {
		currentObject = (ReadableObject) verifiedValue;
		pfa = currentObject.getPropertyFieldAssociation();
		ArrayList<String> allPropertyNames = pfa.getAllPropertyNames();
		for (String s : allPropertyNames) {
			ValueComponent valueComponent = components.get(s);
			Object value = pfa.getProperty(currentObject, s);
			if (value == null) {
				// System.out.println(getClass().getSimpleName()
				// + " could not get a value for " + s);
			} else {
				if (valueComponent == null) {
					// System.out.println(this.getClass().getSimpleName()
					// + " could not find a value component for " + s);
				} else {
					valueComponent.setCurrentVerifiedValue(value);
				}
			}
		}
	}

	@SuppressWarnings("unchecked")
	public PFAContainerValueComponent(String propertyName, String caption,
			ReadableObject pfac, HashMap<String, ReadableObject> allObjects,
			ObjectReader reader) {
		super(propertyName);

		currentObject = pfac;

		setLayout(new BoxLayout(this, BoxLayout.Y_AXIS));
		if (caption != null) {
			setBorder(BorderFactory.createTitledBorder(caption));
		}

		pfa = currentObject.getPropertyFieldAssociation();

		if (pfa == null) {
			System.out.println(getClass() + " could not get a pfa from "
					+ currentObject);
			return;
		}

		int compHeightSum = 0;

		ArrayList<String> allPropertyNames = pfa.getAllPropertyNames();

		LinkedHashMap<String, Integer> groupHeights = new LinkedHashMap<String, Integer>();
		LinkedHashMap<String, JPanel> groupPanels = new LinkedHashMap<String, JPanel>();

		for (String s : allPropertyNames) {
			final Object value = pfa.getProperty(currentObject, s);
			if (value == null) {
				// System.out.println(getClass() + " found a null value in "
				// + currentObject + " for property " + s);
				continue;
			}
			String groupName = pfa.getGroupName(s);
			Container container = this;
			if (groupName != null) {
				JPanel groupPanel = groupPanels.get(groupName);
				if (groupPanel == null) {
					groupPanel = new JPanel();
					groupPanel.setLayout(new BoxLayout(groupPanel,
							BoxLayout.Y_AXIS));
					groupPanels.put(groupName, groupPanel);
					groupHeights.put(groupName, 0);
				}
				container = groupPanel;
			}

			ValueComponent comp = createValueComponent(s, pfa, currentObject,
					value, reader, allObjects);

			components.put(s, comp);
			if (comp != null) {
				comp.setValidatedProperties(pfa);
				comp.addValueChangeListener(new PropertyChangeListener() {
					@Override
					public void propertyChange(PropertyChangeEvent evt) {
						pfa.setProperty(currentObject, evt.getPropertyName(),
								evt.getNewValue());
					}
				});
				container.add(comp);
				int strutHeight = 4;
				container.add(Box.createVerticalStrut(strutHeight));

				int heightInc = comp.getPreferredSize().height + strutHeight;
				if (container == this) {
					compHeightSum += heightInc;
				} else {
					groupHeights.put(groupName, groupHeights.get(groupName)
							+ heightInc);
				}
			} else {
				System.out.println(getClass()
						+ " could not create component for " + value
						+ " propName: " + s);
			}
		}
		if (groupPanels.size() > 0) {
			JTabbedPane tabbedPane = new JTabbedPane();

			int maxHeight = 0;
			for (String groupName : groupPanels.keySet()) {
				JPanel groupPanel = groupPanels.get(groupName);
				groupPanel.add(Box.createVerticalGlue());
				maxHeight = Math.max(groupHeights.get(groupName), maxHeight);
				tabbedPane.addTab(groupName, groupPanel);
			}
			add(tabbedPane);

			setPreferredSize(new Dimension(200, Math.max(100, compHeightSum
					+ maxHeight + 120)));
		} else {
			setPreferredSize(new Dimension(200, Math.max(100,
					compHeightSum + 80)));
		}
		add(Box.createVerticalGlue());

		// System.out.println(this.getClass().getSimpleName() + " " +
		// compHeightSum);
	}

	@Override
	public void propertyChange(PropertyChangeEvent arg0) {
		informAllListeners(currentObject, currentObject);
	}

}
