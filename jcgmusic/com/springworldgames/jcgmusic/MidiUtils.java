package com.springworldgames.jcgmusic;

import java.awt.Component;
import java.util.ArrayList;
import java.util.List;

import javax.sound.midi.InvalidMidiDataException;
import javax.sound.midi.MetaMessage;
import javax.sound.midi.MidiDevice;
import javax.sound.midi.MidiEvent;
import javax.sound.midi.MidiMessage;
import javax.sound.midi.MidiSystem;
import javax.sound.midi.MidiUnavailableException;
import javax.sound.midi.Receiver;
import javax.sound.midi.Sequencer;
import javax.sound.midi.ShortMessage;
import javax.sound.midi.Synthesizer;
import javax.sound.midi.SysexMessage;
import javax.sound.midi.MidiDevice.Info;
import javax.swing.JOptionPane;

public class MidiUtils {

	public static int pitchClassDistance(int c1, int c2) {
		return MathUtils.minInt(Math.abs(c1 - c2), 12 - Math.abs(c1 - c2));
	}

	public static MidiEvent getSetChannelVolumeEvent(int channel, int volume,
			long time) throws Exception {
		return new MidiEvent(getSetChannelVolumeMessage(channel, volume), time);
	}

	public static ShortMessage getPitchBendMessage(int channel, int value) throws InvalidMidiDataException
			{
		ShortMessage sm = new ShortMessage();
		// middle = 8192
		// max = 16383
		// data1 + data2 * 128
		int data1 = value & 0x7f;
		int data2 = value >> 7;
		sm.setMessage(ShortMessage.PITCH_BEND, channel, data1, data2);
		return sm;
	}
	
	public static int[] getPitchBendByteValues(int value) {
		int data1 = value & 0x7f;
		int data2 = value >> 7;
		return new int[] {data1, data2};
	}

	public static MidiMessage getProgramChangeMessage(int channel,
			int programIndex) throws Exception {
		ShortMessage sm = new ShortMessage();
		sm.setMessage(ShortMessage.PROGRAM_CHANGE, channel, programIndex, 1);
		return sm;
	}

	public static MidiMessage getSetChannelVolumeMessage(int channel, int volume)
			throws Exception {
		ShortMessage volumeMessage = new ShortMessage();
		volumeMessage.setMessage(ShortMessage.CONTROL_CHANGE, channel,
				MidiInfo.VOLUME, volume);
		return volumeMessage;
	}

	public static MidiEvent getSetChannelControlEvent(int channel, int data1,
			int data2, long time) throws Exception {
		return new MidiEvent(
				getSetChannelControlMessage(channel, data1, data2), time);
	}

	public static ShortMessage getSetChannelControlMessage(int channel,
			int data1, int data2) throws InvalidMidiDataException {
		ShortMessage volumeMessage = new ShortMessage();
		volumeMessage.setMessage(ShortMessage.CONTROL_CHANGE, channel, data1,
				data2);
		return volumeMessage;
	}

	public static MidiEvent getPitchBendEvent(int channel, int value, long time)
			throws Exception {
		return new MidiEvent(getPitchBendMessage(channel, value), time);
	}

	public static MidiEvent getNoteOnEvent(int note, int channel, int velocity,
			long time) throws Exception {
		return new MidiEvent(getNoteOnMessage(note, channel, velocity), time);
	}

	public static MidiEvent getNoteOffEvent(int note, int channel,
			int velocity, long time) throws Exception {
		return new MidiEvent(getNoteOffMessage(note, channel, velocity), time);
	}

	public static void addNoteOnAndOffEvents(javax.sound.midi.Track track, int note,
			int channel, int onVelocity, int offVelocity, long onTime,
			long offTime) throws Exception {
		MidiEvent[] events = getNoteOnAndOffEvents(note, channel, onVelocity,
				offVelocity, onTime, offTime);
		track.add(events[0]);
		track.add(events[1]);
	}

	public static MidiEvent[] getNoteOnAndOffEvents(int note, int channel,
			int onVelocity, int offVelocity, long onTime, long offTime)
			throws Exception {
		MidiEvent[] result = new MidiEvent[2];
		getNoteOnAndOffEvents(note, channel, onVelocity, offVelocity, onTime,
				offTime, result);
		return result;
	}

	public static MidiMessage[] getNoteOnAndOffMessages(int note, int channel,
			int onVelocity, int offVelocity) throws Exception {
		MidiMessage[] result = new MidiMessage[2];
		getNoteOnAndOffMessages(note, channel, onVelocity, offVelocity, result);
		return result;
	}

	public static void getNoteOnAndOffMessages(int note, int channel,
			int onVelocity, int offVelocity, MidiMessage[] result)
			throws Exception {
		result[0] = getNoteOnMessage(note, channel, onVelocity);
		result[1] = getNoteOffMessage(note, channel, offVelocity);
	}

	public static void getNoteOnAndOffEvents(int note, int channel,
			int onVelocity, int offVelocity, long onTime, long offTime,
			MidiEvent[] result) throws Exception {
		result[0] = getNoteOnEvent(note, channel, onVelocity, onTime);
		result[1] = getNoteOffEvent(note, channel, offVelocity, offTime);
	}

	public static ShortMessage getNoteOnMessage(int note, int channel,
			int velocity) throws Exception {
		ShortMessage onMessage = new ShortMessage();
		onMessage.setMessage(ShortMessage.NOTE_ON, MathUtils.clampIntToInt(
				channel, 0, 127), MathUtils.clampIntToInt(note, 0, 127),
				MathUtils.clampIntToInt(velocity, 0, 127));
		return onMessage;
	}

	public static ShortMessage getAllNotesOffMessage(int channel)
			throws Exception {
		ShortMessage message = new ShortMessage();
		message.setMessage(MidiInfo.ALL_NOTES_OFF, MathUtils.clampIntToInt(
				channel, 0, 127), 0);
		return message;
	}

	public static ShortMessage getAllSoundOffMessage(int channel)
			throws Exception {
		ShortMessage message = new ShortMessage();
		message.setMessage(MidiInfo.ALL_SOUND_OFF, MathUtils.clampIntToInt(
				channel, 0, 127), 0);
		return message;
	}

	public static ShortMessage getNoteOffMessage(int note, int channel,
			int velocity) throws Exception {
		ShortMessage offMessage = new ShortMessage();
		offMessage.setMessage(ShortMessage.NOTE_OFF, MathUtils.clampIntToInt(
				channel, 0, 127), MathUtils.clampIntToInt(note, 0, 127),
				MathUtils.clampIntToInt(velocity, 0, 127));
		return offMessage;
	}

	public static MetaMessage getSetTempoMetaMessage(int bpm) throws Exception {
		int value = 60000000 / bpm;
		byte hb = (byte) ((value >> 16) & 0xff);
		byte mb = (byte) ((value >> 8) & 0xff);
		byte lb = (byte) (value & 0xff);
		MetaMessage result = new MetaMessage();
		result.setMessage(0x51, new byte[] { hb, mb, lb }, 3);
		return result;
	}

	public static String toString(MidiEvent event) {
		return toString(event.getMessage()) + " tick: " + event.getTick();
	}

	public static String toString(MidiMessage message) {
		if (message instanceof ShortMessage) {
			ShortMessage shortMessage = (ShortMessage) message;
			int command = shortMessage.getCommand();
			switch (command) {
			case ShortMessage.NOTE_ON:
				return "NOTE_ON ch: " + shortMessage.getChannel() + " n: "
						+ shortMessage.getData1() + " vel: "
						+ shortMessage.getData2();
			case ShortMessage.NOTE_OFF:
				return "NOTE_OFF ch: " + shortMessage.getChannel() + " n: "
						+ shortMessage.getData1() + " vel: "
						+ shortMessage.getData2();
			default:
				return message.toString();
			}
		} else {
			return message.toString();
		}
	}

	public static void sendNoteOnAndOffMessages(Receiver receiver, int note,
			Integer channel, int onVel, int offVel, double onTick,
			double offTick, long offsetMicroSeconds, long microSecondsPerTick)
			throws Exception {
		sendNoteOnAndOffMessages(receiver, note, channel, onVel, offVel,
				onTick, offTick, offsetMicroSeconds, microSecondsPerTick, 0.0);
	}

	public static void sendNoteOnAndOffMessages(Receiver receiver, int note,
			Integer channel, int onVel, int offVel, double onTick,
			double offTick, long offsetMicroSeconds, long microSecondsPerTick,
			double microSecondsPerTickPerTick) throws Exception {
		MidiMessage[] messages = getNoteOnAndOffMessages(note, channel, onVel,
				offVel);
		long onMicros = (long) (offsetMicroSeconds + microSecondsPerTick
				* onTick + microSecondsPerTickPerTick * onTick * onTick * 0.5);

		long offMicros = (long) (offsetMicroSeconds + microSecondsPerTick
				* offTick + microSecondsPerTickPerTick * offTick * offTick
				* 0.5);

		receiver.send(messages[0], onMicros);
		receiver.send(messages[1], offMicros);

		// System.out.println("MidiUtils sent on/off " + onMicros + "/"
		// + offMicros + " " + " " + note + " " + channel + " " + onVel
		// + " " + offVel);
	}

	public static void sendSysExMessage(Receiver receiver, double tick,
			byte[] message, long offsetMicroSeconds, long microSecondsPerTick)
			throws Exception {
		SysexMessage sysex = new SysexMessage();
		sysex.setMessage(message, message.length);
		receiver.send(sysex, (long) (offsetMicroSeconds + microSecondsPerTick
				* tick));
	}

	public static void sendNoteOnMessage(Receiver receiver, int note,
			Integer channel, int onVel, double onTick, long offsetMicroSeconds,
			long microSecondsPerTick) throws Exception {
		ShortMessage message = getNoteOnMessage(note, channel, onVel);
		receiver.send(message, (long) (offsetMicroSeconds + microSecondsPerTick
				* onTick));
	}

	public static void sendNoteOnMessage(Receiver receiver, int note,
			Integer channel, int onVel, double onTick, long offsetMicroSeconds,
			long microSecondsPerTick, double microSecondsPerTickPerTick)
			throws Exception {
		ShortMessage message = getNoteOnMessage(note, channel, onVel);
		receiver.send(message, (long) (offsetMicroSeconds + microSecondsPerTick
				* onTick + microSecondsPerTickPerTick * onTick * onTick * 0.5));
	}

	public static void sendNoteOffMessage(Receiver receiver, int note,
			Integer channel, int offVel, double offTick,
			long offsetMicroSeconds, long microSecondsPerTick) throws Exception {
		sendNoteOffMessage(receiver, note, channel, offVel, offTick,
				offsetMicroSeconds, microSecondsPerTick, 0.0);
	}

	public static void sendNoteOffMessage(Receiver receiver, int note,
			Integer channel, int offVel, double offTick,
			long offsetMicroSeconds, long microSecondsPerTick,
			double microSecondsPerTickPerTick) throws Exception {
		ShortMessage message = getNoteOffMessage(note, channel, offVel);
		receiver.send(message, (long) (offsetMicroSeconds + microSecondsPerTick
				* offTick + microSecondsPerTickPerTick * offTick * offTick
				* 0.5));
	}


	public static MidiMessage getSetTempoMessage(int bpm) throws Exception {
		final int TEMPO = 0x51;
		int tempoInMPQ = (int) (60000000.0 / bpm);
		byte[] data = new byte[3];
		data[0] = (byte) ((tempoInMPQ >> 16) & 0xFF);
		data[1] = (byte) ((tempoInMPQ >> 8) & 0xFF);
		data[2] = (byte) (tempoInMPQ & 0xFF);
		MetaMessage message = new MetaMessage();
		message.setMessage(TEMPO, data, data.length);
		return message;
	}

}
