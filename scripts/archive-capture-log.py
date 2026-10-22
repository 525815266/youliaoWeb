#!/usr/bin/env python3
"""Run on fnOS: archive a capture log to cloud storage, verify, then reclaim space."""
import argparse
import datetime as dt
import gzip
import hashlib
import json
import os
import pathlib


def archive_capture(source, destination):
    source = pathlib.Path(source).resolve(strict=True)
    destination = pathlib.Path(destination).resolve(strict=True)
    if source.name != 'api-capture.ndjson' or not str(destination).startswith('/vol02/'):
        raise ValueError('Expected api-capture.ndjson and an existing /vol02/ cloud directory')
    stamp = dt.datetime.now().strftime('%Y%m%d-%H%M%S')
    frozen = source.with_name(source.name + '.archiving-' + stamp)
    archive = destination / (source.parent.parent.name + '-' + stamp + '.ndjson.gz')
    stat = source.stat()
    source.rename(frozen)
    # Writers open by pathname for every append; new traffic continues in a new file.
    fd = os.open(source, os.O_WRONLY | os.O_CREAT | os.O_APPEND, stat.st_mode & 0o777)
    os.fchown(fd, stat.st_uid, stat.st_gid)
    os.close(fd)
    digest = hashlib.sha256()
    size = 0
    print(json.dumps({'frozen': str(frozen), 'archive': str(archive), 'bytes': stat.st_size}), flush=True)
    with frozen.open('rb') as src, archive.open('xb') as raw:
        with gzip.GzipFile(fileobj=raw, mode='wb', compresslevel=1) as out:
            while block := src.read(4 * 1024 * 1024):
                out.write(block)
                digest.update(block)
                size += len(block)
        raw.flush()
        os.fsync(raw.fileno())
    verified = hashlib.sha256()
    verified_size = 0
    with gzip.open(archive, 'rb') as handle:
        while block := handle.read(4 * 1024 * 1024):
            verified.update(block)
            verified_size += len(block)
    if verified.digest() != digest.digest() or size != verified_size or frozen.stat().st_size != size:
        raise RuntimeError('Archive verification failed; original frozen file retained')
    result = {'source': str(source), 'archive': str(archive), 'bytes': size,
              'compressedBytes': archive.stat().st_size, 'sha256': digest.hexdigest(), 'verified': True}
    archive.with_suffix(archive.suffix + '.json').write_text(json.dumps(result, indent=2) + '\n')
    frozen.unlink()
    print(json.dumps(result), flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source')
    parser.add_argument('cloud_directory')
    args = parser.parse_args()
    archive_capture(args.source, args.cloud_directory)
