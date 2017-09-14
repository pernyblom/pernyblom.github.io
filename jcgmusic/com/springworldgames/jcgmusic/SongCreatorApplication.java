package com.springworldgames.jcgmusic;

import java.awt.BorderLayout;
import java.awt.EventQueue;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.util.HashMap;

import javax.sound.midi.MidiSystem;
import javax.sound.midi.Sequence;
import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JTabbedPane;

import com.springworldgames.objectreader.ObjectReaderImp;
import com.springworldgames.objectreader.ReadableObject;
import com.springworldgames.swing.valuecomponents.PFAContainerValueComponent;

public class SongCreatorApplication {

	JFrame mainFrame;

	public void start() {

		EventQueue.invokeLater(new Runnable() {

			@Override
			public void run() {
				try {
					final SongCreator creator = new SongCreator();

					ObjectReaderImp reader = new ObjectReaderImp();
					reader.addPackagesString(SongCreator.class);

					JTabbedPane tabbedPane = new JTabbedPane();

					PFAContainerValueComponent component = new PFAContainerValueComponent(
							"", "Song Creator", creator,
							new HashMap<String, ReadableObject>(), reader);

					JPanel generateMainPanel = new JPanel(new BorderLayout());
					tabbedPane.addTab("Song Structure", generateMainPanel);
					generateMainPanel.add(component, BorderLayout.CENTER);

					mainFrame = new JFrame("JcgMusic");
					mainFrame.add(tabbedPane);
					mainFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
					mainFrame.setSize(400, 400);
					mainFrame.setVisible(true);

					final JPanel buttonPanel = new JPanel();
					JButton generateButton = new JButton("Generate");
					generateButton.addActionListener(new ActionListener() {
						@Override
						public void actionPerformed(ActionEvent e) {
							JFileChooser fc = new JFileChooser(new File(
									"DevResources/Sound"));

							int option = fc.showSaveDialog(buttonPanel);
							if (option == JFileChooser.APPROVE_OPTION) {

								File file = fc.getSelectedFile();

								boolean write = true;
								if (file.exists()) {

								}
								if (write) {
									try {
										creator.createSong();
										Sequence sequence = creator
												.generateMidiSequence();
										int[] types = MidiSystem
												.getMidiFileTypes();
										MidiSystem.write(sequence, types[1],
												file);
									} catch (Exception ex) {
										ex.printStackTrace();
									}
								}
							}
						}
					});

					buttonPanel.add(generateButton);
					generateMainPanel.add(buttonPanel, BorderLayout.SOUTH);

					// PFAContainerValueComponentDialog dialog = new
					// PFAContainerValueComponentDialog(
					// component, "Create", "Cancel");
					// dialog.setVisible(true);
					//
					// if (dialog.getButtonIndex() == 0) {
					//
					// }
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});

	}

	public static void main(String[] args) {
		SongCreatorApplication application = new SongCreatorApplication();
		application.start();
	}

}
