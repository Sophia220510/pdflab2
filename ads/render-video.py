"""Combine the seven PDF-based slides with the supplied Portuguese narration.

Run render-voice.ps1 and render-slides.mjs first. Requires ffmpeg on PATH.
"""

from pathlib import Path
import subprocess
import wave


root = Path(__file__).resolve().parents[1]
work = root / ".work" / "ads"
output = root / "ads" / "hemograma-demonstracao-vertical.mp4"


def wav_duration(path: Path) -> float:
    with wave.open(str(path), "rb") as audio:
        return audio.getnframes() / audio.getframerate()


voices = [work / f"voice-{index}.wav" for index in range(1, 5)]
slides = [work / f"scene-{index}.png" for index in range(1, 8)]
for source in voices + slides:
    if not source.is_file():
        raise SystemExit(f"Missing input: {source}")

voice_lengths = [wav_duration(path) for path in voices]
durations = [
    voice_lengths[0] * 0.43,
    voice_lengths[0] * 0.57,
    voice_lengths[1] * 0.42,
    voice_lengths[1] * 0.30,
    voice_lengths[1] * 0.28,
    voice_lengths[2],
    voice_lengths[3] + 0.75,
]

audio_list = work / "audio-list.txt"
audio_list.write_text("".join(f"file 'voice-{index}.wav'\n" for index in range(1, 5)), encoding="utf-8")
slide_list = work / "slide-list.txt"
slide_list.write_text(
    "".join(
        f"file 'scene-{index}.png'\nduration {duration:.6f}\n"
        for index, duration in enumerate(durations, start=1)
    ) + "file 'scene-7.png'\n",
    encoding="utf-8",
)

voice_track = work / "voice.wav"
video_track = work / "silent-video.mp4"
subprocess.run(
    ["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(audio_list),
     "-c:a", "pcm_s16le", str(voice_track)],
    check=True,
)
subprocess.run(
    ["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(slide_list),
     "-vf", "fps=30,format=yuv420p", "-c:v", "libx264", "-preset", "medium", "-crf", "19",
     "-movflags", "+faststart", str(video_track)],
    check=True,
)
subprocess.run(
    ["ffmpeg", "-y", "-loglevel", "error", "-i", str(video_track), "-i", str(voice_track),
     "-filter_complex", "[1:a]apad=pad_dur=0.75[a]", "-map", "0:v", "-map", "[a]",
     "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart",
     str(output)],
    check=True,
)
print(f"Rendered {output} ({sum(durations):.2f} s, 1080x1920)")
