# vi: set ft=ruby

Vagrant.configure('2') do |config|
  config.vm.box = 'playa_mesos_ubuntu_14.04'
  config.vm.box_url = "http://downloads.mesosphere.io/playa-mesos/#{config.vm.box}.box"

  config.vm.network :private_network, ip: ENV['VM_IP'] || '10.141.141.10'

  config.vm.provision :shell, inline: <<-eof.gsub(/^\s*/, '')
    set -o errexit

    # marathon: enable event subscriptions
    mkdir -p /etc/marathon/conf
    echo http_callback > /etc/marathon/conf/event_subscriber

    # chronos: install
    pushd /opt
      rm -fr chronos
      curl -sSfL \
        http://downloads.mesosphere.io/chronos/chronos-2.1.0_mesos-0.14.0-rc4.tgz \
        --output chronos.tgz
      tar xzf chronos.tgz
      rm -f chronos.tgz
    popd

    # chronos: init
    cat << EOF > /etc/init/chronos.conf
    description "Chronos"

    start on runlevel [2345]
    stop on runlevel [!2345]

    respawn
    respawn limit 10 5

    exec /opt/chronos/bin/start-chronos.bash --master zk://localhost:2181/mesos --zk_hosts zk://localhost:2181/mesos --http_port 4400
    EOF

    # chronos: start
    service chronos restart
  eof

  config.vm.provider :virtualbox do |v|
    v.customize ['modifyvm', :id, '--cpus', ENV['VM_CPUS'] || '2']
    v.customize ['modifyvm', :id, '--memory', ENV['VM_MEMORY'] || 2048]
    v.customize ['modifyvm', :id, '--natdnshostresolver1', 'on']
    v.customize ['modifyvm', :id, '--natdnsproxy1', 'on']
    v.customize ['setextradata', :id, 'VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root', '1']
  end

  config.ssh.forward_agent = true
end
