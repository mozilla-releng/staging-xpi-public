# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
"""
Apply some defaults and minor modifications to the jobs defined in the build
kind.
"""

from __future__ import absolute_import, print_function, unicode_literals
from copy import deepcopy
import json
import os

from taskgraph.transforms.base import TransformSequence
from xpi_taskgraph.utils import get_manifest


transforms = TransformSequence()


@transforms.add
def test_tasks_from_manifest(config, tasks):
    manifest = get_manifest()
    for task in tasks:
        dep = task.pop("primary-dependency")
        task["attributes"] = dep.attributes.copy()
        task["dependencies"] = {"build": dep.label}
        xpi_name = dep.task["extra"]["xpi-name"]
        task.setdefault("extra", {})["xpi-name"] = xpi_name
        for xpi_config in manifest:
            if xpi_config["name"] == xpi_name:
                break
        else:
            raise Exception("Can't determine the upstream xpi_config for {}!".format(xpi_name))
        env = task.setdefault("worker", {}).setdefault("env", {})
        run = task.setdefault("run", {})
        if 'directory' in xpi_config:
            run['cwd'] = '{checkout}/%s' % xpi_config['directory']
        else:
            run['cwd'] = '{checkout}'
        task["label"] = "test-{}".format(xpi_name)
        task["treeherder"]["symbol"] = "T({})".format(
            xpi_config.get("treeherder-symbol", xpi_config["name"])
        )
        try:
            checkout_config['ssh_secret_name'] = config.graph_config["github_clone_secret"]
            artifact_prefix = "xpi/build"
        except KeyError:
            artifact_prefix = "public/build"
        env["ARTIFACT_PREFIX"] = artifact_prefix

        yield task
